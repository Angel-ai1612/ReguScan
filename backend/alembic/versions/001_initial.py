"""Initial schema

Revision ID: 001_initial
Revises: 
Create Date: 2026-06-11
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "organizations",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("slug", sa.String(100), unique=True, nullable=False),
        sa.Column("plan", sa.String(50), nullable=False, server_default="free"),
        sa.Column("stripe_customer_id", sa.String(100)),
        sa.Column("stripe_subscription_id", sa.String(100)),
        sa.Column("subscription_status", sa.String(50), server_default="incomplete"),
        sa.Column("subscription_current_period_start", sa.DateTime(timezone=True)),
        sa.Column("subscription_current_period_end", sa.DateTime(timezone=True)),
        sa.Column("usage_limits", postgresql.JSONB, server_default="{}"),
        sa.Column("settings", postgresql.JSONB, server_default="{}"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
        sa.Column("deleted_at", sa.DateTime(timezone=True)),
    )
    op.create_index("idx_orgs_plan", "organizations", ["plan"])
    op.create_index("idx_orgs_stripe_customer", "organizations", ["stripe_customer_id"])

    op.create_table(
        "users",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("clerk_id", sa.String(100), unique=True, nullable=False),
        sa.Column("email", sa.String(255), nullable=False, unique=True),
        sa.Column("first_name", sa.String(100)),
        sa.Column("last_name", sa.String(100)),
        sa.Column("avatar_url", sa.Text()),
        sa.Column("org_id", sa.String(), sa.ForeignKey("organizations.id", ondelete="SET NULL")),
        sa.Column("role", sa.String(50), server_default="member"),
        sa.Column("last_login_at", sa.DateTime(timezone=True)),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )
    op.create_index("idx_users_org", "users", ["org_id"])
    op.create_index("idx_users_clerk", "users", ["clerk_id"])

    op.create_table(
        "websites",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("org_id", sa.String(), sa.ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False),
        sa.Column("url", sa.String(2048), nullable=False),
        sa.Column("name", sa.String(255)),
        sa.Column("description", sa.Text()),
        sa.Column("screenshot_url", sa.Text()),
        sa.Column("favicon_url", sa.Text()),
        sa.Column("last_scan_id", sa.String()),
        sa.Column("last_scan_at", sa.DateTime(timezone=True)),
        sa.Column("compliance_score", sa.Integer()),
        sa.Column("overall_risk_tier", sa.String(50)),
        sa.Column("scan_settings", postgresql.JSONB, server_default="{}"),
        sa.Column("is_active", sa.Boolean(), server_default="true"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
        sa.UniqueConstraint("org_id", "url", name="uq_website_org_url"),
    )
    op.create_index("idx_websites_org", "websites", ["org_id"])
    op.create_index("idx_websites_risk", "websites", ["overall_risk_tier"])

    op.create_table(
        "scans",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("website_id", sa.String(), sa.ForeignKey("websites.id", ondelete="CASCADE"), nullable=False),
        sa.Column("status", sa.String(50), nullable=False, server_default="pending"),
        sa.Column("stage", sa.String(100)),
        sa.Column("progress_percent", sa.Integer(), server_default="0"),
        sa.Column("started_at", sa.DateTime(timezone=True)),
        sa.Column("completed_at", sa.DateTime(timezone=True)),
        sa.Column("failed_at", sa.DateTime(timezone=True)),
        sa.Column("error_message", sa.Text()),
        sa.Column("error_details", postgresql.JSONB),
        sa.Column("crawl_results", postgresql.JSONB),
        sa.Column("classification_results", postgresql.JSONB),
        sa.Column("gap_summary", postgresql.JSONB),
        sa.Column("compliance_score", sa.Integer()),
        sa.Column("estimated_fine_exposure", postgresql.JSONB),
        sa.Column("report_url", sa.Text()),
        sa.Column("celery_task_id", sa.String(100)),
        sa.Column("triggered_by", sa.String(50), server_default="manual"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )
    op.create_index("idx_scans_website", "scans", ["website_id"])
    op.create_index("idx_scans_status", "scans", ["status"])
    op.create_index("idx_scans_created", "scans", ["created_at"])

    op.create_table(
        "ai_systems",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("website_id", sa.String(), sa.ForeignKey("websites.id", ondelete="CASCADE"), nullable=False),
        sa.Column("scan_id", sa.String(), sa.ForeignKey("scans.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("system_type", sa.String(100), nullable=False),
        sa.Column("provider", sa.String(100)),
        sa.Column("risk_category", sa.String(50), nullable=False),
        sa.Column("risk_category_confidence", sa.Float()),
        sa.Column("classification_reasoning", sa.Text()),
        sa.Column("applicable_articles", postgresql.JSONB),
        sa.Column("detection_evidence", postgresql.JSONB),
        sa.Column("page_url", sa.Text()),
        sa.Column("is_active", sa.Boolean(), server_default="true"),
        sa.Column("first_detected_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
        sa.Column("last_detected_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
        sa.Column("manually_overridden", sa.Boolean(), server_default="false"),
        sa.Column("override_reason", sa.Text()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )
    op.create_index("idx_ai_systems_website", "ai_systems", ["website_id"])
    op.create_index("idx_ai_systems_scan", "ai_systems", ["scan_id"])
    op.create_index("idx_ai_systems_risk", "ai_systems", ["risk_category"])

    op.create_table(
        "gaps",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("ai_system_id", sa.String(), sa.ForeignKey("ai_systems.id", ondelete="CASCADE"), nullable=False),
        sa.Column("scan_id", sa.String(), sa.ForeignKey("scans.id", ondelete="CASCADE"), nullable=False),
        sa.Column("obligation_code", sa.String(100), nullable=False),
        sa.Column("obligation_description", sa.Text(), nullable=False),
        sa.Column("severity", sa.String(20), nullable=False),
        sa.Column("status", sa.String(20), server_default="open"),
        sa.Column("remediation_suggestion", sa.Text()),
        sa.Column("remediation_code_snippet", sa.Text()),
        sa.Column("remediation_template_url", sa.Text()),
        sa.Column("resolved_at", sa.DateTime(timezone=True)),
        sa.Column("resolved_by", sa.String(), sa.ForeignKey("users.id")),
        sa.Column("resolution_notes", sa.Text()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )
    op.create_index("idx_gaps_system", "gaps", ["ai_system_id"])
    op.create_index("idx_gaps_severity", "gaps", ["severity"])
    op.create_index("idx_gaps_status", "gaps", ["status"])

    op.create_table(
        "documents",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("org_id", sa.String(), sa.ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False),
        sa.Column("ai_system_id", sa.String(), sa.ForeignKey("ai_systems.id", ondelete="SET NULL")),
        sa.Column("document_type", sa.String(100), nullable=False),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("content_markdown", sa.Text(), nullable=False),
        sa.Column("content_html", sa.Text()),
        sa.Column("generated_data", postgresql.JSONB),
        sa.Column("status", sa.String(50), server_default="draft"),
        sa.Column("reviewed_by", sa.String(), sa.ForeignKey("users.id")),
        sa.Column("approved_by", sa.String(), sa.ForeignKey("users.id")),
        sa.Column("version", sa.Integer(), server_default="1"),
        sa.Column("previous_version_id", sa.String(), sa.ForeignKey("documents.id")),
        sa.Column("pdf_url", sa.Text()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )

    op.create_table(
        "api_keys",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("org_id", sa.String(), sa.ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(100), nullable=False),
        sa.Column("key_hash", sa.String(255), nullable=False),
        sa.Column("key_prefix", sa.String(20), nullable=False),
        sa.Column("permissions", postgresql.JSONB, server_default='["read","scan"]'),
        sa.Column("last_used_at", sa.DateTime(timezone=True)),
        sa.Column("expires_at", sa.DateTime(timezone=True)),
        sa.Column("is_active", sa.Boolean(), server_default="true"),
        sa.Column("created_by", sa.String(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )

    op.create_table(
        "webhooks",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("org_id", sa.String(), sa.ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False),
        sa.Column("url", sa.String(2048), nullable=False),
        sa.Column("secret", sa.String(255)),
        sa.Column("events", postgresql.JSONB, nullable=False),
        sa.Column("is_active", sa.Boolean(), server_default="true"),
        sa.Column("last_delivered_at", sa.DateTime(timezone=True)),
        sa.Column("last_delivery_status", sa.Integer()),
        sa.Column("failure_count", sa.Integer(), server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )

    op.create_table(
        "audit_logs",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("org_id", sa.String(), sa.ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False),
        sa.Column("user_id", sa.String(), sa.ForeignKey("users.id")),
        sa.Column("action", sa.String(100), nullable=False),
        sa.Column("resource_type", sa.String(100)),
        sa.Column("resource_id", sa.String()),
        sa.Column("details", postgresql.JSONB),
        sa.Column("ip_address", sa.String(45)),
        sa.Column("user_agent", sa.Text()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )
    op.create_index("idx_audit_logs_org", "audit_logs", ["org_id"])
    op.create_index("idx_audit_logs_created", "audit_logs", ["created_at"])


def downgrade() -> None:
    for table in [
        "audit_logs", "webhooks", "api_keys", "documents",
        "gaps", "ai_systems", "scans", "websites", "users", "organizations",
    ]:
        op.drop_table(table)

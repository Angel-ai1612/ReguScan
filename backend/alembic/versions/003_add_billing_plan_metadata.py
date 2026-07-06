"""Add billing plan metadata

Revision ID: 003_add_billing_plan_metadata
Revises: 002_add_razorpay_billing_fields
Create Date: 2026-07-07
"""

from alembic import op
import sqlalchemy as sa

revision = "003_add_billing_plan_metadata"
down_revision = "002_add_razorpay_billing_fields"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("organizations", sa.Column("plan_updated_at", sa.DateTime(timezone=True)))
    op.add_column("organizations", sa.Column("razorpay_last_event_id", sa.String(100)))
    op.add_column("organizations", sa.Column("razorpay_last_event_at", sa.DateTime(timezone=True)))
    op.create_index(
        "idx_orgs_razorpay_last_event",
        "organizations",
        ["razorpay_last_event_id"],
    )


def downgrade() -> None:
    op.drop_index("idx_orgs_razorpay_last_event", table_name="organizations")
    op.drop_column("organizations", "razorpay_last_event_at")
    op.drop_column("organizations", "razorpay_last_event_id")
    op.drop_column("organizations", "plan_updated_at")

"""SQLAlchemy ORM models for ReguScan."""
import uuid
from datetime import datetime

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.session import Base


def gen_uuid():
    return str(uuid.uuid4())


class Organization(Base):
    __tablename__ = "organizations"

    id = Column(String(), primary_key=True, default=gen_uuid)
    name = Column(String(255), nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    plan = Column(String(50), nullable=False, default="free")
    # Deprecated legacy payment identifiers are kept for non-destructive migration safety.
    stripe_customer_id = Column(String(100))
    stripe_subscription_id = Column(String(100))
    razorpay_customer_id = Column(String(100))
    razorpay_order_id = Column(String(100))
    razorpay_payment_id = Column(String(100))
    razorpay_subscription_id = Column(String(100))
    razorpay_plan_id = Column(String(100))
    razorpay_last_event_id = Column(String(100))
    razorpay_last_event_at = Column(DateTime(timezone=True))
    subscription_status = Column(String(50), default="incomplete")
    subscription_current_period_start = Column(DateTime(timezone=True))
    subscription_current_period_end = Column(DateTime(timezone=True))
    plan_updated_at = Column(DateTime(timezone=True))
    usage_limits = Column(JSONB, default=dict)
    settings = Column(JSONB, default=dict)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True))

    users = relationship("User", back_populates="organization")
    websites = relationship("Website", back_populates="organization")
    documents = relationship("Document", back_populates="organization")
    api_keys = relationship("APIKey", back_populates="organization")
    webhooks = relationship("Webhook", back_populates="organization")


class User(Base):
    __tablename__ = "users"

    id = Column(String(), primary_key=True, default=gen_uuid)
    clerk_id = Column(String(100), unique=True, nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    first_name = Column(String(100))
    last_name = Column(String(100))
    avatar_url = Column(Text)
    org_id = Column(String(), ForeignKey("organizations.id", ondelete="SET NULL"))
    role = Column(String(50), default="member")
    last_login_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    organization = relationship("Organization", back_populates="users")


class Website(Base):
    __tablename__ = "websites"

    id = Column(String(), primary_key=True, default=gen_uuid)
    org_id = Column(String(), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    url = Column(String(2048), nullable=False)
    name = Column(String(255))
    description = Column(Text)
    screenshot_url = Column(Text)
    favicon_url = Column(Text)
    last_scan_id = Column(String())
    last_scan_at = Column(DateTime(timezone=True))
    compliance_score = Column(Integer)
    overall_risk_tier = Column(String(50))
    scan_settings = Column(JSONB, default=dict)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        UniqueConstraint("org_id", "url", name="uq_website_org_url"),
        CheckConstraint("compliance_score BETWEEN 0 AND 100", name="ck_compliance_score"),
    )

    organization = relationship("Organization", back_populates="websites")
    scans = relationship("Scan", back_populates="website", cascade="all, delete-orphan")
    ai_systems = relationship("AISystem", back_populates="website")


class Scan(Base):
    __tablename__ = "scans"

    id = Column(String(), primary_key=True, default=gen_uuid)
    website_id = Column(String(), ForeignKey("websites.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(50), nullable=False, default="pending")
    stage = Column(String(100))
    progress_percent = Column(Integer, default=0)
    started_at = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))
    failed_at = Column(DateTime(timezone=True))
    error_message = Column(Text)
    error_details = Column(JSONB)
    crawl_results = Column(JSONB)
    classification_results = Column(JSONB)
    gap_summary = Column(JSONB)
    compliance_score = Column(Integer)
    estimated_fine_exposure = Column(JSONB)
    report_url = Column(Text)
    celery_task_id = Column(String(100))
    triggered_by = Column(String(50), default="manual")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        CheckConstraint("progress_percent BETWEEN 0 AND 100", name="ck_progress"),
    )

    website = relationship("Website", back_populates="scans")
    ai_systems = relationship("AISystem", back_populates="scan")
    gaps = relationship("Gap", back_populates="scan")


class AISystem(Base):
    __tablename__ = "ai_systems"

    id = Column(String(), primary_key=True, default=gen_uuid)
    website_id = Column(String(), ForeignKey("websites.id", ondelete="CASCADE"), nullable=False)
    scan_id = Column(String(), ForeignKey("scans.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    system_type = Column(String(100), nullable=False)
    provider = Column(String(100))
    risk_category = Column(String(50), nullable=False)
    risk_category_confidence = Column(Float)
    classification_reasoning = Column(Text)
    applicable_articles = Column(JSONB)
    detection_evidence = Column(JSONB)
    page_url = Column(Text)
    is_active = Column(Boolean, default=True)
    first_detected_at = Column(DateTime(timezone=True), server_default=func.now())
    last_detected_at = Column(DateTime(timezone=True), server_default=func.now())
    manually_overridden = Column(Boolean, default=False)
    override_reason = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        CheckConstraint("risk_category_confidence BETWEEN 0 AND 1", name="ck_confidence"),
    )

    website = relationship("Website", back_populates="ai_systems")
    scan = relationship("Scan", back_populates="ai_systems")
    gaps = relationship("Gap", back_populates="ai_system")
    documents = relationship("Document", back_populates="ai_system")


class Gap(Base):
    __tablename__ = "gaps"

    id = Column(String(), primary_key=True, default=gen_uuid)
    ai_system_id = Column(String(), ForeignKey("ai_systems.id", ondelete="CASCADE"), nullable=False)
    scan_id = Column(String(), ForeignKey("scans.id", ondelete="CASCADE"), nullable=False)
    obligation_code = Column(String(100), nullable=False)
    obligation_description = Column(Text, nullable=False)
    severity = Column(String(20), nullable=False)
    status = Column(String(20), default="open")
    remediation_suggestion = Column(Text)
    remediation_code_snippet = Column(Text)
    remediation_template_url = Column(Text)
    resolved_at = Column(DateTime(timezone=True))
    resolved_by = Column(String(), ForeignKey("users.id"))
    resolution_notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        CheckConstraint("severity IN ('critical', 'high', 'medium', 'low')", name="ck_severity"),
        CheckConstraint("status IN ('open', 'in_progress', 'resolved', 'accepted_risk')", name="ck_status"),
    )

    ai_system = relationship("AISystem", back_populates="gaps")
    scan = relationship("Scan", back_populates="gaps")


class Document(Base):
    __tablename__ = "documents"

    id = Column(String(), primary_key=True, default=gen_uuid)
    org_id = Column(String(), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    ai_system_id = Column(String(), ForeignKey("ai_systems.id", ondelete="SET NULL"))
    document_type = Column(String(100), nullable=False)
    title = Column(String(255), nullable=False)
    content_markdown = Column(Text, nullable=False)
    content_html = Column(Text)
    generated_data = Column(JSONB)
    status = Column(String(50), default="draft")
    reviewed_by = Column(String(), ForeignKey("users.id"))
    approved_by = Column(String(), ForeignKey("users.id"))
    version = Column(Integer, default=1)
    previous_version_id = Column(String(), ForeignKey("documents.id"))
    pdf_url = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    organization = relationship("Organization", back_populates="documents")
    ai_system = relationship("AISystem", back_populates="documents")


class APIKey(Base):
    __tablename__ = "api_keys"

    id = Column(String(), primary_key=True, default=gen_uuid)
    org_id = Column(String(), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(100), nullable=False)
    key_hash = Column(String(255), nullable=False)
    key_prefix = Column(String(20), nullable=False)
    permissions = Column(JSONB, default=list)
    last_used_at = Column(DateTime(timezone=True))
    expires_at = Column(DateTime(timezone=True))
    is_active = Column(Boolean, default=True)
    created_by = Column(String(), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    organization = relationship("Organization", back_populates="api_keys")


class Webhook(Base):
    __tablename__ = "webhooks"

    id = Column(String(), primary_key=True, default=gen_uuid)
    org_id = Column(String(), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    url = Column(String(2048), nullable=False)
    secret = Column(String(255))
    events = Column(JSONB, nullable=False)
    is_active = Column(Boolean, default=True)
    last_delivered_at = Column(DateTime(timezone=True))
    last_delivery_status = Column(Integer)
    failure_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    organization = relationship("Organization", back_populates="webhooks")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(), primary_key=True, default=gen_uuid)
    org_id = Column(String(), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String(), ForeignKey("users.id"))
    action = Column(String(100), nullable=False)
    resource_type = Column(String(100))
    resource_id = Column(String())
    details = Column(JSONB)
    ip_address = Column(String(45))
    user_agent = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

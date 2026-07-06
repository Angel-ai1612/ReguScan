"""Add Razorpay billing fields

Revision ID: 002_add_razorpay_billing_fields
Revises: 001_initial
Create Date: 2026-07-06
"""

from alembic import op
import sqlalchemy as sa

revision = "002_add_razorpay_billing_fields"
down_revision = "001_initial"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("organizations", sa.Column("razorpay_customer_id", sa.String(100)))
    op.add_column("organizations", sa.Column("razorpay_order_id", sa.String(100)))
    op.add_column("organizations", sa.Column("razorpay_payment_id", sa.String(100)))
    op.add_column("organizations", sa.Column("razorpay_subscription_id", sa.String(100)))
    op.add_column("organizations", sa.Column("razorpay_plan_id", sa.String(100)))
    op.create_index(
        "idx_orgs_razorpay_customer",
        "organizations",
        ["razorpay_customer_id"],
    )
    op.create_index(
        "idx_orgs_razorpay_order",
        "organizations",
        ["razorpay_order_id"],
    )
    op.create_index(
        "idx_orgs_razorpay_subscription",
        "organizations",
        ["razorpay_subscription_id"],
    )


def downgrade() -> None:
    op.drop_index("idx_orgs_razorpay_subscription", table_name="organizations")
    op.drop_index("idx_orgs_razorpay_order", table_name="organizations")
    op.drop_index("idx_orgs_razorpay_customer", table_name="organizations")
    op.drop_column("organizations", "razorpay_plan_id")
    op.drop_column("organizations", "razorpay_subscription_id")
    op.drop_column("organizations", "razorpay_payment_id")
    op.drop_column("organizations", "razorpay_order_id")
    op.drop_column("organizations", "razorpay_customer_id")

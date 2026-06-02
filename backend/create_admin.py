#!/usr/bin/env python
"""
Create or update admin user for Meenu-Dev
Run this script to set up the admin credentials for testing the admin panel.
"""

import sys
from sqlalchemy.orm import Session
from app.models.user import User
from app.database.session import engine, get_db
from app.models.base import Base

# Ensure tables exist
Base.metadata.create_all(bind=engine)

# Get a database session
db = next(get_db())

try:
    # Check if admin exists with new email
    admin = db.query(User).filter(User.email == "admin@meenu-dev.com").first()
    
    if admin:
        print(f"✅ Admin user already exists: {admin.email}")
        print(f"   Role: {admin.role}")
        print(f"   Active: {admin.is_active}")
    else:
        # Create new admin user
        admin = User(
            username="meenu_admin",
            email="admin@meenu-dev.com",
            role="admin",
            is_active=True
        )
        admin.set_password("AdminPass123!")
        db.add(admin)
        db.commit()
        db.refresh(admin)
        print("✅ Admin user created successfully!")
        print(f"   Email: {admin.email}")
        print(f"   Role: {admin.role}")
    
    # Also check for old admin email and migrate if needed
    old_admin = db.query(User).filter(User.email == "admin@portfolio.dev").first()
    if old_admin and old_admin.id != admin.id:
        print(f"\n⚠️  Old admin account found: {old_admin.email}")
        print("   (You can delete this manually if no longer needed)")
    
    print("\n" + "="*60)
    print("📋 ADMIN CREDENTIALS")
    print("="*60)
    print(f"Email:    admin@meenu-dev.com")
    print(f"Password: AdminPass123!")
    print("="*60)
    print("\n✨ Use these credentials to log in to the admin panel")
    print("   at http://localhost:5173/admin/login")
    
except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)
finally:
    db.close()

"""
Database Connection Test Script for Supabase + SQLAlchemy
Tests the DATABASE_URL and connection settings
"""

import os
import sys
from dotenv import load_dotenv
import psycopg2
from sqlalchemy import create_engine, text
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def test_raw_psycopg2_connection():
    """Test direct psycopg2 connection (lowest level)"""
    logger.info("\n" + "="*60)
    logger.info("TEST 1: Raw psycopg2 Connection")
    logger.info("="*60)
    
    try:
        # Extract connection params from DATABASE_URL
        # Format: postgresql+psycopg2://user:password@host:port/database
        
        url_parts = DATABASE_URL.replace("postgresql+psycopg2://", "")
        user_pass, host_db = url_parts.split("@")
        user, password = user_pass.split(":")
        host_port, database = host_db.split("/")
        host, port = host_port.split(":")
        
        logger.info(f"Connecting to: {host}:{port}")
        logger.info(f"Database: {database}")
        logger.info(f"User: {user}")
        
        conn = psycopg2.connect(
            host=host,
            port=int(port),
            user=user,
            password=password,
            database=database,
            sslmode='require'  # Required for Supabase
        )
        
        cursor = conn.cursor()
        cursor.execute("SELECT version();")
        version = cursor.fetchone()
        
        logger.info(f"✓ SUCCESS: Connected to PostgreSQL")
        logger.info(f"  Version: {version[0]}")
        
        cursor.close()
        conn.close()
        return True
        
    except psycopg2.OperationalError as e:
        logger.error(f"✗ FAILED: {e}")
        if "could not translate host name" in str(e):
            logger.error("  → DNS resolution failed. Check:")
            logger.error("    1. Domain name: db.ezaierqywmjgknrkxxwd.supabase.co")
            logger.error("    2. Internet connection")
            logger.error("    3. College WiFi/firewall blocking port 5432")
        return False
    except Exception as e:
        logger.error(f"✗ ERROR: {e}")
        return False


def test_sqlalchemy_connection():
    """Test SQLAlchemy engine connection"""
    logger.info("\n" + "="*60)
    logger.info("TEST 2: SQLAlchemy Engine Connection")
    logger.info("="*60)
    
    if not DATABASE_URL:
        logger.error("✗ DATABASE_URL not set in .env file")
        return False
    
    logger.info(f"DATABASE_URL: {DATABASE_URL[:50]}...")
    
    try:
        # Create engine
        engine = create_engine(
            DATABASE_URL,
            echo=False,
            pool_pre_ping=True,
            connect_args={"connect_timeout": 10}
        )
        
        # Test connection
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            logger.info("✓ SUCCESS: SQLAlchemy connected successfully")
            return True
            
    except Exception as e:
        logger.error(f"✗ FAILED: {e}")
        return False


def test_environment_variables():
    """Check if .env file is properly loaded"""
    logger.info("\n" + "="*60)
    logger.info("TEST 0: Environment Variables")
    logger.info("="*60)
    
    if DATABASE_URL:
        logger.info(f"✓ DATABASE_URL is set")
        logger.info(f"  Format: {DATABASE_URL.split('@')[0]}...@{DATABASE_URL.split('@')[1]}")
        
        # Check for sslmode
        if "sslmode=require" in DATABASE_URL:
            logger.info("✓ sslmode=require is present")
        else:
            logger.warning("✗ sslmode=require is MISSING - required for Supabase!")
            return False
        
        # Check for correct postgresql+psycopg2 prefix
        if DATABASE_URL.startswith("postgresql+psycopg2://"):
            logger.info("✓ Correct database URL format (postgresql+psycopg2://)")
        else:
            logger.error("✗ Wrong database URL format")
            return False
        
        return True
    else:
        logger.error("✗ DATABASE_URL is not set in .env file")
        return False


def main():
    """Run all tests"""
    logger.info("\n" + "="*60)
    logger.info("SUPABASE + SQLALCHEMY DIAGNOSTIC TEST")
    logger.info("="*60)
    
    results = []
    
    # Run tests in order
    results.append(("Environment Variables", test_environment_variables()))
    results.append(("Raw psycopg2 Connection", test_raw_psycopg2_connection()))
    results.append(("SQLAlchemy Connection", test_sqlalchemy_connection()))
    
    # Summary
    logger.info("\n" + "="*60)
    logger.info("TEST SUMMARY")
    logger.info("="*60)
    
    for test_name, passed in results:
        status = "✓ PASS" if passed else "✗ FAIL"
        logger.info(f"{status}: {test_name}")
    
    all_passed = all(result for _, result in results)
    
    if all_passed:
        logger.info("\n✓ All tests passed! Your connection is working.")
        sys.exit(0)
    else:
        logger.info("\n✗ Some tests failed. See above for details.")
        logger.info("\nCommon fixes:")
        logger.info("1. Add ?sslmode=require to DATABASE_URL")
        logger.info("2. Check internet connection")
        logger.info("3. Verify Supabase database credentials")
        logger.info("4. Check college WiFi/firewall for port 5432 blocking")
        sys.exit(1)


if __name__ == "__main__":
    main()

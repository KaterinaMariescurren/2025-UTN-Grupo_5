import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

from app.main import app
from app.bd.sesion import Base, get_db

# BD de test PostgreSQL (sync)
TEST_DATABASE_URL = "postgresql://test:test@localhost:5432/beyoureyes_test"

# Engine de pruebas (SYNC)
engine_test = create_engine(TEST_DATABASE_URL)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine_test
)

# Override para FastAPI
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

# Crear / eliminar tablas
@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.drop_all(bind=engine_test)
    Base.metadata.create_all(bind=engine_test)
    yield
    Base.metadata.drop_all(bind=engine_test)

# Cliente sync para tests
@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c

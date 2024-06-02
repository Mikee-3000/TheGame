from db.database import SessionLocal
from fastapi import HTTPException, Request, Response


def setup_accept_header(app):
    @app.middleware("http")
    async def add_accept_ch_header(request: Request, call_next):
        try:
            response = await call_next(request)
            # Set the Accept-CH header
            response.headers["Accept-CH"] = "Sec-CH-UA,Sec-CH-UA-Arch,Sec-CH-UA-Bitness,Sec-CH-UA-Full-Version-List,Sec-CH-UA-Mobile,Sec-CH-UA-Model,Sec-CH-UA-Platform,Sec-CH-UA-Platform-Version"
            return response
        except HTTPException as exc:
            # Update the headers of the exception response
            for key, value in response.headers.items():
                exc.headers[key] = value

            raise exc
    
# Each request needs an independent session
def db_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
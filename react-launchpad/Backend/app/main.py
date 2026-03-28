import uvicorn
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.routes import career, cv
from app.core.config import settings

# --- APPLICATION INITIALIZATION ---
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Refined Career Intelligence OS - v4.0 High-Density Logic",
    version="4.0.0"
)

# --- CORS ORCHESTRATION ---
# This is vital for your React team. It allows their frontend to 
# communicate with this logic layer without browser security blocks.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

# --- GLOBAL LOGIC AUDITOR (Error Handler) ---
# This catches any Internal Server Errors (500) and prints the 
# trace directly to your terminal while returning a clean JSON to the UI.
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"\n--- [CRITICAL SYSTEM AUDIT FAILURE] ---")
    print(f"Endpoint: {request.method} {request.url.path}")
    print(f"Reason: {str(exc)}")
    print(f"----------------------------------------\n")
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal Logic Failure",
            "audit_note": str(exc),
            "system_status": "Maintenance Mode"
        }
    )

# --- ROUTE REGISTRATION ---
# Modular mounting of our high-substance features
app.include_router(career.router, prefix="/api", tags=["Diagnostic Engine"])
app.include_router(cv.router, prefix="/api", tags=["Hiring Simulator"])

# --- SYSTEM MONITORING ---
@app.get("/health", tags=["System"])
def health_check():
    """
    Returns the operational status of the CI-OS engine.
    """
    return {
        "status": "operational",
        "engine": "v4.0-vector-isolated",
        "math_modules": ["Euclidean_6D", "Jaccard_Transferable", "Sigmoid_Risk"],
        "isolated_keys_loaded": all([settings.KEY_CAREER, settings.KEY_CV_SIM, settings.KEY_CV_IMPROVE])
    }

# --- SERVER RUNNER ---
if __name__ == "__main__":
    # We use app.main:app string format to enable high-speed 'reload' during dev
    uvicorn.run(
        "app.main:app", 
        host="0.0.0.0", 
        port=settings.PORT, 
        reload=True,
        log_level="info"
    )
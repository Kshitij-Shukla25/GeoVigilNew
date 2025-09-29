from flask import Flask, jsonify, render_template, redirect, url_for, request, session
import random
import time
from datetime import datetime, timedelta

# Flask app ka instance banaya gaya hai
app = Flask(__name__)

# --- Configuration (optional, but good practice for session) ---
app.secret_key = 'your_super_secret_key' 
# -----------------------------------------------------------------


# Main route jo login.html template ko serve karega
@app.route("/")
def index():
    # Redirect to the main login page
    return redirect(url_for('login'))
    
@app.route("/login")
def login():
    return render_template("login.html")

@app.route('/user_registration')
def user_registration():
    return render_template('user_registration.html')

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

@app.route('/sensors')
def sensors():
    return render_template('sensor.html')

@app.route('/reports')
def reports():
    return render_template('reports.html')

@app.route('/settings')
def settings():
    return render_template('settings.html') 

@app.route('/worker_approval')
def worker_approval():
    return render_template('worker_approval.html') 

@app.route('/logout')
def logout():
    session.clear() 
    return redirect(url_for('login')) 


# API endpoint jo sensor data aur risk level provide karega
@app.route("/api/live_data")
def get_live_data():
    """
    Provides live changing data for dashboard updates (AJAX), 
    including all six geotechnical sensor values and seismic summary.
    """
    
    # --- Data Ranges Based on Visuals (for realistic simulation) ---
    DISPLACEMENT_RANGE = (4.0, 5.5)     
    VIBRATION_RANGE = (17.0, 19.0)      
    PORE_PRESSURE_RANGE = (20.0, 24.0)  
    STRAIN_RANGE = (25.0, 30.0)         
    GPS_RANGE_X = (4.0, 5.0)            
    AE_RANGE = (10.0, 15.0)             

    # Primary trigger for risk status (using Vibration as a key indicator)
    vibration_val = round(random.uniform(*VIBRATION_RANGE), 3)

    # --- New Seismic Data Simulation for Environmental Trigger Overview ---
    high_freq_amplitude = round(random.uniform(0.5e-5, 2.0e-5), 6) # e.g., 1.2e-5 V
    seismic_activity_level = "NORMAL"
    if high_freq_amplitude > 1.5e-5:
        seismic_activity_level = "ELEVATED"
    elif high_freq_amplitude > 1.8e-5:
        seismic_activity_level = "HIGH"

    if vibration_val > 18.5 or seismic_activity_level == "HIGH":
        risk_status = "High Risk"
        risk_probability = random.randint(70, 95)
    elif vibration_val > 17.5 or seismic_activity_level == "ELEVATED":
        risk_status = "Moderate Risk"
        risk_probability = random.randint(30, 69)
    else:
        risk_status = "Low Risk"
        risk_probability = random.randint(5, 29)

    data = {
        # Risk Status (for Alert Banner)
        "risk_status": risk_status,
        "risk_probability": risk_probability,
        
        # Geotechnical Monitoring Data (All 6 displayed values)
        "displacement": round(random.uniform(*DISPLACEMENT_RANGE), 2),
        "vibration": vibration_val,
        "pore_pressure": round(random.uniform(*PORE_PRESSURE_RANGE), 2),
        "strain": round(random.uniform(*STRAIN_RANGE), 3),
        "gps_x": random.randint(4, 5),
        "gps_y": random.randint(10, 30),
        "acoustic_emission": round(random.uniform(*AE_RANGE), 2),

        # New Environmental Trigger Data
        "seismic_activity_level": seismic_activity_level,
        "max_freq_amplitude": high_freq_amplitude,
    }
    return jsonify(data)

@app.route("/api/seismic_data")
def get_seismic_data():
    """
    Generates simulated real-time and frequency-domain seismic data.
    """
    time_series_data = []
    frequency_spectrum_data = []
    
    # Simulate 1 hour of data, 1 point per minute
    now = datetime.now()
    for i in range(60): # 60 points for 1 hour
        timestamp = (now - timedelta(minutes=59-i)).strftime("%H:%M")
        
        # Simulate ground acceleration (time-domain)
        # Adding some "high frequency" noise for rockfall simulation
        base_signal = random.uniform(0.01, 0.05) * random.choice([-1,1]) # small random fluctuations
        rockfall_spike = 0 
        if random.random() < 0.1: # 10% chance of a small "rockfall event" spike
             rockfall_spike = random.uniform(0.1, 0.5) * random.choice([-1,1])
        
        amplitude = round(base_signal + rockfall_spike, 3)
        time_series_data.append({"time": timestamp, "amplitude": amplitude})

    # Simulate frequency spectrum (fixed frequencies, changing amplitudes)
    frequencies = [0.1, 0.5, 1.0, 5.0, 10.0, 15.0, 20.0, 30.0, 40.0, 50.0] # Frequencies in Hz
    
    # Simulate amplitudes, with higher values for high frequencies during "events"
    seismic_event_factor = 1 # Multiplier for high-frequency amplitudes
    if random.random() < 0.2: # 20% chance of an "event" affecting frequency spectrum
        seismic_event_factor = random.uniform(1.5, 3.0)

    for freq in frequencies:
        amplitude_val = random.uniform(0.5e-6, 1.0e-5) # Base amplitude
        if freq >= 10: # Higher frequencies might be more active
            amplitude_val *= seismic_event_factor 
            amplitude_val = min(amplitude_val, 2.5e-5) # Cap max amplitude
        
        frequency_spectrum_data.append({"frequency": freq, "amplitude": f"{amplitude_val:.1e}"}) # Format to scientific notation

    return jsonify({
        "time_series": time_series_data,
        "frequency_spectrum": frequency_spectrum_data
    })


if __name__ == "__main__":
    app.run(debug=True, port=5001)

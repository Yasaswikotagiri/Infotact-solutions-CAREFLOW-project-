import os
import random
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def generate_ehr_logs(output_dir="data", num_patients=1000):
    os.makedirs(output_dir, exist_ok=True)
    print(f"Generating realistic EHR event logs for CareFlow in '{output_dir}'...")

    activities = [
        "Emergency Intake",
        "Triage Assessment",
        "Vitals Measurement",
        "Doctor Examination",
        "Radiology / X-Ray",
        "Laboratory Test",
        "Intake Form Re-Triage", # Bottleneck Loop-back Activity
        "Treatment / Medication",
        "Billing & Discharge"
    ]

    doctors = [f"Dr. Smith (ER)", f"Dr. Patel (Trauma)", f"Dr. Johnson (General)", f"Dr. Wong (Radiology)"]
    departments = ["Intake", "Triage", "Radiology", "Lab", "Emergency Ward", "Billing"]

    event_logs = []
    start_date = datetime(2026, 8, 1, 8, 0, 0)

    for p_id in range(100, 100 + num_patients):
        case_id = f"PAT_{p_id:04d}"
        curr_time = start_date + timedelta(minutes=random.randint(0, 14400)) # spread over days

        # Base clinical path
        path = ["Emergency Intake", "Triage Assessment", "Vitals Measurement", "Doctor Examination"]
        
       # Operational bottleneck:
       # X-Ray patients with missing paperwork are sent back to Intake/Triage.
        has_xray = random.random() < 0.60
        has_paperwork_error = has_xray and (random.random() < 0.40) 
        # 40% of X-ray patients sent back to Triage

        if has_xray:
            path.append("Radiology / X-Ray")
            if has_paperwork_error:
                # Operational Inefficiency: Sent back to Triage to fix intake paperwork!
                path.append("Intake Form Re-Triage")
                path.append("Doctor Examination")

        if random.random() < 0.50:
            path.append("Laboratory Test")

        path.append("Treatment / Medication")
        path.append("Billing & Discharge")

        for step in path:
            # Transition duration based on activity type
            if step == "Emergency Intake":
                duration_mins = random.randint(2, 8)
                dept = "Intake"
                doc = "N/A"
            elif step == "Triage Assessment":
                duration_mins = random.randint(5, 15)
                dept = "Triage"
                doc = "Nurse Station"
            elif step == "Vitals Measurement":
                duration_mins = random.randint(5, 10)
                dept = "Triage"
                doc = "Nurse Station"
            elif step == "Doctor Examination":
                duration_mins = random.randint(15, 45)
                dept = "Emergency Ward"
                doc = random.choice(doctors[:3])
            elif step == "Radiology / X-Ray":
                duration_mins = random.randint(20, 60)
                dept = "Radiology"
                doc = "Dr. Wong (Radiology)"
            elif step == "Intake Form Re-Triage":
                # Bottleneck delay! High wait time due to missing paperwork
                duration_mins = random.randint(25, 55)
                dept = "Triage"
                doc = "Intake Desk"
            elif step == "Laboratory Test":
                duration_mins = random.randint(30, 90)
                dept = "Lab"
                doc = "Lab Tech"
            elif step == "Treatment / Medication":
                duration_mins = random.randint(15, 30)
                dept = "Emergency Ward"
                doc = random.choice(doctors[:3])
            elif step == "Billing & Discharge":
                duration_mins = random.randint(10, 20)
                dept = "Billing"
                doc = "Billing Admin"

            curr_time += timedelta(minutes=duration_mins)

            event_logs.append({
                "case_id": case_id,
                "activity_name": step,
                "timestamp": curr_time.strftime("%Y-%m-%d %H:%M:%S"),
                "department": dept,
                "resource": doc,
                "duration_minutes": duration_mins,
                "patient_age": random.randint(18, 82),
                "severity_level": random.choice(["Low", "Moderate", "Critical"])
            })

    df = pd.DataFrame(event_logs)
    df.to_csv(os.path.join(output_dir, "ehr_raw_event_logs.csv"), index=False)
    print(f"Successfully generated {len(df)} EHR events for {num_patients} patient journeys!")

if __name__ == "__main__":
    generate_ehr_logs()

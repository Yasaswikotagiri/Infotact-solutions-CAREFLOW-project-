# CareFlow: Clinical Pathway Process Mining

## Overview
CareFlow is a healthcare operations data engineering pipeline and process mining dashboard that discovers actual, unscripted patient journeys from raw Electronic Health Record (EHR) timestamped event logs. By deploying PM4Py process mining algorithms and dbt ELT models over Google BigQuery, CareFlow uncovers hidden operational bottlenecks, such as patients being sent back to Triage due to missing intake paperwork.

## Project Goals

- Generate realistic EHR event logs
- Discover clinical process flows
- Identify bottlenecks
- Perform conformance checking
- Visualize results through an interactive dashboard

## Architecture
1. **Data Warehouse (Google BigQuery)**: Stores chronological EHR event logs (`Case_ID`, `Activity_Name`, `Timestamp`, `Department`, `Resource`).
2. **Event Log Normalizer (`dbt_careflow/`)**: Standardizes raw EHR data and computes transition time metrics across clinical activities.
3. **Process Mining Engine (`process_mining_engine.py`)**: Uses Python PM4Py / NetworkX graph algorithms to discover Directly-Follows Graphs (DFG), trace variant frequencies, and perform conformance checking against mandated pathways.
4. **BI & Flow Dashboard (`dashboard/index.html`)**: Interactive process map visualizer highlighting spaghetti diagrams, bottleneck callouts, filter controls (Doctor, Severity), and ROI savings metrics.

## Quick Start
```bash
# 1. Install dependencies
pip install pandas numpy networkx

# 2. Generate synthetic EHR event logs
python ehr_simulator.py

# 3. Run Process Mining Discovery Engine
python process_mining_engine.py

# 4. Launch Dashboard
# Open dashboard/index.html in any modern web browser
```
## Project Outputs

The pipeline produces:

- ehr_raw_event_logs.csv
- dfg_transitions_summary.csv
- process_bottlenecks.csv
- conformance_audit.csv
- dashboard_data.json

## Dashboard Features

- Doctor filter
- Severity filter
- Conformance KPIs
- DFG transition analysis
- Path variant analysis
- Bottleneck identification
- Dynamic clinical process map

## Key Finding

The process mining analysis identifies a paperwork-related
loop-back from Radiology / X-Ray to Intake Form Re-Triage.

## Development

CareFlow was developed incrementally through data generation,
process discovery, conformance analysis, SQL transformation,
dashboard integration, testing and documentation.

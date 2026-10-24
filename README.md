# CareFlow: Clinical Pathway Process Mining

## Overview

CareFlow is a healthcare operations data engineering pipeline and process mining dashboard that discovers actual, unscripted patient journeys from raw Electronic Health Record (EHR) timestamped event logs. By deploying PM4Py process mining algorithms and dbt ELT models over Google BigQuery, CareFlow uncovers hidden operational bottlenecks, such as patients being sent back to Triage due to missing intake paperwork.

## Project Goals

Generate realistic EHR event logs
Discover clinical process flows
Identify bottlenecks
Perform conformance checking
Visualize results through an interactive dashboard

## Architecture

Data Warehouse (Google BigQuery) : Stores chronological EHR event logs (Case_ID, Activity_Name, Timestamp, Department, Resource).

Event Log Normalizer (dbt_careflow/) : Standardizes raw EHR data and computes transition time metrics across clinical activities.

Process Mining Engine (process_mining_engine.py) : Uses Python PM4Py / NetworkX graph algorithms to discover Directly-Follows Graphs (DFG), trace variant frequencies, and perform conformance checking against mandated pathways.

BI & Flow Dashboard (dashboard/index.html) : Interactive process map visualizer highlighting spaghetti diagrams, bottleneck callouts, filter controls (Doctor, Severity), and ROI savings metrics.

## Quick Start

### 1. Install dependencies
pip install pandas numpy networkx

### 2. Generate synthetic EHR event logs
python ehr_simulator.py

### 3. Run Process Mining Discovery Engine
python process_mining_engine.py

### 4. Launch Dashboard
### Open dashboard/index.html in any modern web browser

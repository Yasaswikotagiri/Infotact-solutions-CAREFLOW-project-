# CareFlow: Clinical Pathway Process Mining

**A Healthcare Data Analytics and Process Mining Project**

CareFlow is a healthcare operations analytics project designed to analyze synthetic Electronic Health Record (EHR) event logs, understand patient journey sequences, measure transitions between clinical activities, and identify potential workflow bottlenecks.

The project uses Python and Pandas to generate and analyze patient activity records. It produces structured CSV reports that can support further analysis of clinical workflows and operational performance.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Problem Statement](#2-problem-statement)
3. [Project Objectives](#3-project-objectives)
4. [Project Architecture](#4-project-architecture)
5. [Technology Stack](#5-technology-stack)
6. [Repository Structure](#6-repository-structure)
7. [Dataset Description](#7-dataset-description)
8. [Installation and Setup](#8-installation-and-setup)
9. [How to Run the Project](#9-how-to-run-the-project)
10. [Process Mining Methodology](#10-process-mining-methodology)
11. [Output Files](#11-output-files)
12. [Dashboard](#12-dashboard)
13. [Key Performance Indicators](#13-key-performance-indicators)
14. [Business Applications](#14-business-applications)
15. [Limitations](#15-limitations)
16. [Future Enhancements](#16-future-enhancements)
17. [Conclusion](#17-conclusion)

---

## 1. Project Overview

Healthcare organizations manage complex patient journeys involving multiple departments, healthcare professionals, examinations, tests, treatments, and discharge procedures.

Understanding how patients move through these activities can help identify delays, repeated steps, and opportunities to improve operational efficiency.

**CareFlow: Clinical Pathway Process Mining** explores this problem using synthetic EHR event data and process-oriented analytics.

The project consists of a Python-based event log generator, a process analysis engine, CSV output reports, a dashboard directory, and dbt model files.

The current Python pipeline focuses on:

- Generating synthetic patient activity records.
- Recording timestamps, departments, and responsible resources.
- Reconstructing patient activity sequences.
- Calculating transition frequencies and elapsed times.
- Identifying transitions with comparatively high elapsed times.
- Flagging patient journeys that contain the simulated paperwork re-triage activity.
- Exporting analysis results for further inspection and visualization.

The project is intended for educational and analytical purposes. It uses simulated patient data rather than real patient medical records.

## 2. Problem Statement

Patient journeys may not always follow an expected clinical workflow. Missing paperwork, repeated assessments, departmental handoffs, and inefficient processes can introduce additional work and delays.

Without structured analysis of event logs, these workflow patterns may be difficult to identify.

CareFlow addresses this challenge by creating synthetic patient journey data and analyzing the sequence and timing of clinical activities.

The project uses a simulated paperwork-related re-triage scenario to demonstrate how additional activities and transition delays can be examined through process-oriented analytics.

**Example scenario:**

A patient arrives at the emergency department and completes intake, triage, and an initial medical examination. The patient is then sent for an X-ray. If a simulated paperwork error occurs, the patient follows an additional re-triage activity before returning to a doctor examination.

By analyzing these event sequences, CareFlow can identify the frequency of transitions and calculate elapsed times between recorded activities.

## 3. Project Objectives

The primary objectives are:

1. **Synthetic Data Generation:** Generate structured EHR event records for simulated patient journeys.
2. **Event Log Preparation:** Organize clinical activities chronologically for each patient case.
3. **Process Flow Analysis:** Identify directly following activity pairs and measure their frequencies.
4. **Time Analysis:** Calculate elapsed time between consecutive recorded activities.
5. **Bottleneck Identification:** Rank activity transitions by average elapsed time to highlight areas for further investigation.
6. **Conformance-Oriented Analysis:** Flag patient journeys containing the simulated paperwork re-triage activity or repeated activities.
7. **Report Generation:** Export process transition summaries, bottleneck rankings, and case-level audit records as CSV files.
8. **Visualization:** Provide a foundation for presenting workflow patterns and analytical results through a dashboard.

## 4. Project Architecture

The project is organized into the following logical components.

### 4.1 Synthetic EHR Event Generator

**File:** `ehr_simulator.py`

The generator creates simulated patient activity records.

It defines a collection of clinical activities, assigns departments and resources, generates timestamps, and introduces a simulated paperwork-related re-triage scenario for some patient journeys.

The default configuration generates 1,000 patient cases.

Each generated event includes information such as:

- Patient case identifier.
- Clinical activity.
- Event timestamp.
- Department.
- Assigned resource.
- Activity duration.
- Patient age.
- Severity level.

The generated records are saved to `data/ehr_raw_event_logs.csv`.

### 4.2 Process Analysis Engine

**File:** `process_mining_engine.py`

The analysis engine loads the generated event log and sorts events by patient case and timestamp.

It then calculates transitions between consecutive activities, summarizes transition frequencies and elapsed times, ranks transitions by average elapsed time, and generates case-level conformance-oriented audit records.

The engine writes its analysis results to the `output/` directory.

If the expected event log is missing, the script attempts to generate it using `ehr_simulator.py`.

### 4.3 Data Transformation Models

**Directory:** `dbt_careflow/models/`

This directory contains dbt model files intended to support event log standardization and analytical data preparation.

The models can be inspected and developed further as part of a data transformation workflow.

A successful dbt run requires the appropriate dbt installation, project configuration, adapter, and data warehouse connection. These steps are separate from running the standalone Python scripts.

### 4.4 Dashboard

**Directory:** `dashboard/`

This directory contains the dashboard entry point, `index.html`.

It is intended to provide a visual interface for exploring the project's process analysis.

Dashboard functionality depends on the implementation in the included HTML, JavaScript, and any supporting assets. The presence of the directory alone does not establish that every analytical output is automatically connected to the dashboard.

### 4.5 Overall Workflow

The intended analytical workflow is:

1. Generate synthetic EHR events.
2. Save the event log as a CSV file.
3. Load and chronologically sort the events.
4. Derive transitions between consecutive activities.
5. Calculate transition frequencies and elapsed-time statistics.
6. Rank transitions by average elapsed time.
7. Generate case-level conformance-oriented audit records.
8. Save the reports for inspection and potential visualization.

## 5. Technology Stack

| Technology | Purpose |
|---|---|
| Python | Main programming language |
| Pandas | Data processing, grouping, sorting, and CSV operations |
| NumPy | Imported by the Python scripts and available for numerical operations |
| CSV | Storage format for event logs and analysis reports |
| dbt | Data transformation framework represented by the model directory |
| HTML | Dashboard entry point |
| Git and GitHub | Version control and project hosting |

**Implementation note:** The current Python analysis script performs its transition calculations using Pandas. PM4Py, NetworkX, and Google BigQuery are not established as active dependencies of the reviewed Python execution path. They can be introduced or integrated as the project evolves.

## 6. Repository Structure

The repository contains the following main files and directories:

```text
Infotact-solutions-CAREFLOW-project-/
│
├── dashboard/
│   └── index.html
│
├── data/
│   └── ehr_raw_event_logs.csv
│
├── dbt_careflow/
│   └── models/
│       └── [dbt model files]
│
├── output/
│   ├── dfg_transitions_summary.csv
│   ├── process_bottlenecks.csv
│   └── conformance_audit.csv
│
├── .gitattributes
├── README.md
├── ehr_simulator.py
└── process_mining_engine.py
```

The CSV files under `data/` and `output/` may be generated or updated when the scripts run.

The exact contents of the `dbt_careflow/models/` directory depend on the model files maintained in the repository.

## 7. Dataset Description

### 7.1 Data Source

The Python generator creates synthetic EHR events. The records do not originate from actual patients or a production hospital information system.

The generator creates 1,000 patient cases by default, with case identifiers beginning at `PAT_0100`.

The initial simulated event time is based on August 1, 2026, at 08:00, with patient journeys distributed across a simulated period.

### 7.2 Event Log Schema

The generated event log contains the following columns:

| Column | Description |
|---|---|
| `case_id` | Unique identifier for a simulated patient journey |
| `activity_name` | Name of the clinical activity |
| `timestamp` | Timestamp associated with the event |
| `department` | Department associated with the activity |
| `resource` | Assigned staff role or resource |
| `duration_minutes` | Simulated duration assigned to the activity |
| `patient_age` | Simulated patient age |
| `severity_level` | Simulated severity category |

### 7.3 Simulated Clinical Activities

The generator defines these activities:

- Emergency Intake
- Triage Assessment
- Vitals Measurement
- Doctor Examination
- Radiology / X-Ray
- Laboratory Test
- Intake Form Re-Triage
- Treatment / Medication
- Billing & Discharge

The exact sequence varies across simulated patient cases.

### 7.4 Simulated Workflow Variation

The generator introduces variations in patient journeys.

For example:

- Some patients undergo an X-ray.
- Some patients undergo a laboratory test.
- Some patients experience an additional paperwork-related re-triage activity.
- Activity durations vary within the ranges defined in the generator.

These variations provide data for demonstrating process analysis.

**Important:** The generated frequencies and delays are determined by simulation rules and random values. They should not be interpreted as actual hospital performance statistics.

## 8. Installation and Setup

### 8.1 Prerequisites

Install the following:

- Python 3.9 or later is recommended.
- Git, if you intend to clone the repository.
- A terminal or command prompt.
- A modern web browser for opening the dashboard.

The core Python scripts require Pandas and NumPy.

### 8.2 Clone the Repository

Run:

```bash
git clone https://github.com/Yasaswikotagiri/Infotact-solutions-CAREFLOW-project-.git
```

Move into the project directory:

```bash
cd Infotact-solutions-CAREFLOW-project-
```

### 8.3 Create a Virtual Environment

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it on Windows:

```bash
.venv\Scripts\activate
```

On macOS or Linux:

```bash
source .venv/bin/activate
```

### 8.4 Install Dependencies

Install the required Python libraries:

```bash
python -m pip install pandas numpy
```

Verify the installation:

```bash
python -c "import pandas, numpy; print('Dependencies installed successfully')"
```

If your system uses `python3` instead of `python`, substitute `python3` in the commands where appropriate.

## 9. How to Run the Project

Run the scripts from the repository's root directory.

### Step 1: Generate Synthetic EHR Event Logs

Execute:

```bash
python ehr_simulator.py
```

The script generates synthetic patient activity records and writes them to:

```text
data/ehr_raw_event_logs.csv
```

The output directory is created automatically if it does not exist.

The generator uses 1,000 patient cases by default.

### Step 2: Run the Process Analysis Engine

Execute:

```bash
python process_mining_engine.py
```

The script loads the event log, sorts the events, calculates activity transitions, identifies high-average-time transitions, and produces conformance-oriented audit records.

The analysis output is written to the `output/` directory.

If the input CSV is missing, the engine attempts to generate a new event log before continuing.

### Step 3: Inspect the Generated Reports

After a successful run, inspect the following files:

```text
output/dfg_transitions_summary.csv
output/process_bottlenecks.csv
output/conformance_audit.csv
```

These reports can be opened in spreadsheet software or loaded into a separate data visualization tool.

### Step 4: Open the Dashboard

The dashboard entry point is:

```text
dashboard/index.html
```

Open the file in a modern web browser.

The available visualizations and controls depend on the current dashboard implementation. The Python-generated reports and the dashboard should be checked separately to confirm whether the reports are automatically loaded and displayed.

## 10. Process Mining Methodology

### 10.1 Event Sorting

The engine converts the event timestamp column to a datetime representation and sorts events by:

1. Patient case identifier.
2. Event timestamp.

This establishes the recorded sequence of activities for each case.

### 10.2 Directly-Follows Transitions

A directly-follows transition represents an activity followed immediately by another activity within the same patient case.

For example:

```text
Emergency Intake
        |
        v
Triage Assessment
        |
        v
Vitals Measurement
        |
        v
Doctor Examination
```

The engine identifies these transitions using grouped event sequences.

For each transition pair, it calculates:

- Transition frequency.
- Average elapsed time.
- Median elapsed time.
- Maximum elapsed time.

The results are written to `dfg_transitions_summary.csv`.

### 10.3 Elapsed-Time Analysis

For each event, the engine compares its timestamp with the timestamp of the next event in the same case.

The elapsed time is calculated in minutes:

```text
Elapsed time = Next event timestamp - Current event timestamp
```

These values represent elapsed time between recorded events. They should not automatically be interpreted as pure waiting time because the calculation does not separately distinguish waiting time from activity execution time.

### 10.4 Bottleneck Ranking

The engine sorts transition summaries by average elapsed time in descending order.

The resulting report is saved as:

```text
output/process_bottlenecks.csv
```

This report helps identify transitions with high average elapsed times.

A high average alone does not prove that a transition is operationally inefficient. The results should be interpreted alongside transition frequency, activity duration, workflow context, and the assumptions built into the synthetic data.

### 10.5 Conformance-Oriented Audit

The script defines an expected clinical pathway:

```text
Emergency Intake
        |
        v
Triage Assessment
        |
        v
Vitals Measurement
        |
        v
Doctor Examination
        |
        v
Treatment / Medication
        |
        v
Billing & Discharge
```

It examines the activity sequence for each patient case and flags cases containing the simulated `Intake Form Re-Triage` activity.

It also includes a check for repeated activity names.

The resulting records are exported to:

```text
output/conformance_audit.csv
```

**Implementation limitation:** The current check is a simplified rule-based audit, not a complete formal conformance-checking implementation. It does not validate every activity sequence against the expected pathway, and its treatment of additional legitimate activities is limited.

## 11. Output Files

### 11.1 `dfg_transitions_summary.csv`

Contains aggregated information about consecutive activity pairs.

Expected columns:

| Column | Meaning |
|---|---|
| `activity_name` | Current activity |
| `next_activity` | Following activity |
| `frequency` | Number of observed transitions |
| `avg_wait_time_mins` | Average elapsed time between the two recorded events, in minutes |
| `median_wait_time_mins` | Median elapsed time, in minutes |
| `max_wait_time_mins` | Maximum elapsed time, in minutes |

This report can be used to examine common activity transitions and their associated elapsed times.

### 11.2 `process_bottlenecks.csv`

Contains transition summaries sorted by average elapsed time, from highest to lowest.

This ranking supports initial investigation of potentially time-consuming transitions.

It is a ranking of elapsed-time measurements, not an independently validated list of confirmed operational bottlenecks.

### 11.3 `conformance_audit.csv`

Contains case-level records generated by the simplified conformance-oriented checks.

The report includes:

- `case_id`
- `total_activities`
- `conformance_status`
- `path_sequence`

These fields help identify simulated patient journeys containing the paperwork re-triage activity and review their recorded sequences.

### 11.4 Reproducibility

The generator uses random values for patient journeys, timestamps, durations, and patient attributes. It does not set a fixed random seed in its current implementation.

Consequently, separate executions may produce different event logs and analytical results.

The printed KPI values should be interpreted in the context of the particular dataset generated during that run.

## 12. Dashboard

The repository includes a dashboard entry point at:

```text
dashboard/index.html
```

The dashboard is intended to support exploration of clinical workflow information.

Potential areas for visualization include:

- Patient activity sequences.
- Common transitions between clinical activities.
- Transition frequencies.
- Elapsed-time comparisons.
- Potential bottlenecks.
- Patient case variations.

The exact features available depend on the current dashboard source code.

To verify the dashboard, open the HTML file in a browser and check that the interface loads correctly and that any required data files are accessible.

If the dashboard is intended to consume the Python-generated reports, confirm that its code reads the correct file paths and that the reports are available in the expected location.

## 13. Key Performance Indicators

The project can support analysis of several workflow metrics.

| Metric | Description |
|---|---|
| Total patient cases | Number of unique patient case identifiers in the event log |
| Total events | Number of activity records |
| Transition frequency | Number of times one activity directly follows another |
| Average transition elapsed time | Mean elapsed time between consecutive recorded activities |
| Median transition elapsed time | Median elapsed time between consecutive recorded activities |
| Maximum transition elapsed time | Largest elapsed time observed for a transition pair |
| Re-triage case count | Number of cases flagged for the simulated paperwork re-triage activity |
| Re-triage case percentage | Percentage of analyzed cases containing the flagged re-triage activity |

The re-triage case percentage can be expressed as:

```text
Re-triage case percentage =
    (Number of cases containing the re-triage activity
     / Total number of analyzed cases) × 100
```

These metrics describe the generated dataset. They are not clinical outcome measures and should not be used to make decisions about real patients.

## 14. Business Applications

The CareFlow approach illustrates how healthcare operations data can support workflow analysis.

### Workflow Visibility

Chronologically ordered event logs help reveal how simulated patient cases move between activities.

### Operational Investigation

Transition frequency and elapsed-time reports can help analysts identify areas that deserve closer investigation.

### Process Standardization

Comparing observed sequences with an expected pathway can provide a starting point for reviewing workflow deviations.

### Data Analytics Practice

The project demonstrates practical concepts in data generation, timestamp processing, event sequence analysis, aggregation, reporting, and data visualization.

### Healthcare Operations Research

The synthetic dataset can be extended to explore how changes in workflow rules or activity durations affect measured process metrics.

These are potential applications of the analytical approach. Demonstrating real-world operational improvement would require validated data, appropriate evaluation methods, and domain expertise.

## 15. Limitations

The current implementation has several important limitations.

1. **Synthetic data:** The event logs are generated from predefined rules and random values. They do not represent a validated sample of real hospital operations.

2. **Simplified process analysis:** Transition metrics are calculated using Pandas. The current implementation should not be described as a complete PM4Py-based process discovery pipeline.

3. **Elapsed time versus waiting time:** Differences between consecutive timestamps can include both activity duration and time between activities. They do not independently measure queue waiting time.

4. **Simplified conformance checks:** The current checks focus on the simulated re-triage activity and repeated activity names rather than comprehensive validation of every expected sequence.

5. **Randomized results:** The generator does not use a fixed random seed, so results may change between runs.

6. **Database integration:** A working Google BigQuery connection has not been established by the reviewed Python scripts.

7. **Dashboard integration:** The dashboard's ability to load and display generated reports must be verified against its actual implementation.

8. **Clinical use:** The project is an educational analytics demonstration and is not intended for diagnosis, treatment decisions, or production clinical workflow management.

## 16. Future Enhancements

The following improvements could extend the project.

### Data Engineering

- Add schema validation and data quality checks.
- Handle missing timestamps and duplicate events.
- Standardize event names, departments, and resource values.
- Introduce a reproducible random seed for testing.

### Process Mining

- Integrate a formal process mining library such as PM4Py.
- Add richer process discovery and trace variant analysis.
- Implement more comprehensive conformance checking.
- Separate activity execution time from inter-activity waiting time.
- Add frequency thresholds and configurable bottleneck criteria.

### Data Warehouse

- Configure a dbt project with the required adapter and connection settings.
- Integrate a data warehouse such as Google BigQuery if required.
- Validate transformation models and document their dependencies.

### Dashboard and Reporting

- Connect the dashboard to generated CSV reports.
- Add filters for department, severity, activity, and patient case.
- Visualize transition frequency and elapsed-time metrics.
- Provide clear explanations of metric definitions and limitations.
- Add data refresh and error-handling mechanisms.

### Testing and Documentation

- Add unit tests for event generation and transition calculations.
- Validate output schemas and empty-input behavior.
- Document environment requirements and troubleshooting steps.
- Add screenshots of verified dashboard functionality.
- Record reproducible example outputs for demonstrations.

These items are proposed enhancements, not claims that the features are already implemented.

## 17. Conclusion

CareFlow demonstrates how synthetic EHR event logs can be used to explore clinical workflow patterns through data analytics.

By generating patient activity records, ordering events chronologically, calculating transition frequencies and elapsed times, and flagging simulated paperwork-related re-triage cases, the project provides a foundation for studying healthcare process efficiency.

The resulting CSV reports can support further analysis, visualization, and development of more advanced process mining capabilities.

The project also illustrates important data analytics concepts, including data generation, preprocessing, aggregation, time-based analysis, rule-based auditing, and structured reporting.

**CareFlow is an educational prototype intended to demonstrate healthcare workflow analytics using synthetic data. Its outputs should not be interpreted as validated findings about real clinical operations.**

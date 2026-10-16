-- dbt Model: event_log_normalized.sql
-- Description: Standardizes raw EHR logs from Google BigQuery into canonical Process Mining Event Log format

WITH raw_ehr AS (
    SELECT 
        case_id,
        activity_name,
        PARSE_TIMESTAMP('%Y-%m-%d %H:%M:%S', timestamp) AS event_timestamp,
        department,
        resource,
        duration_minutes,
        patient_age,
        severity_level
    FROM {{ source('bigquery_ehr', 'raw_event_logs') }}
)
-- Convert raw EHR fields into canonical process-mining fields.
SELECT 
    case_id AS Case_ID,
    activity_name AS Activity_Name,
    event_timestamp AS Timestamp,
    department AS Department,
    resource AS Resource_ID,
    duration_minutes AS Activity_Duration_Mins,
    severity_level AS Severity,
    ROW_NUMBER() OVER (PARTITION BY case_id ORDER BY event_timestamp) AS Event_Order
FROM raw_ehr;

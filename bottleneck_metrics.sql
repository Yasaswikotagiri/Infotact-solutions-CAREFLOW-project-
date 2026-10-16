-- dbt Model: bottleneck_metrics.sql
-- Description: Calculates transition time and bottleneck loop-back metrics between clinical activities

WITH ordered_events AS (
    SELECT 
        Case_ID,
        Activity_Name,
        Timestamp,
        LEAD(Activity_Name) OVER (PARTITION BY Case_ID ORDER BY Timestamp) AS Next_Activity_Name,
        LEAD(Timestamp) OVER (PARTITION BY Case_ID ORDER BY Timestamp) AS Next_Timestamp
    FROM {{ ref('event_log_normalized') }}
)

SELECT 
    Activity_Name AS Source_Activity,
    Next_Activity_Name AS Target_Activity,
    COUNT(DISTINCT Case_ID) AS Transition_Count,
    ROUND(AVG(TIMESTAMP_DIFF(Next_Timestamp, Timestamp, MINUTE)), 2) AS Avg_Transition_Wait_Time_Mins,
    ROUND(MAX(TIMESTAMP_DIFF(Next_Timestamp, Timestamp, MINUTE)), 2) AS Max_Transition_Wait_Time_Mins,
    CASE 
        WHEN Activity_Name = 'Radiology / X-Ray' AND Next_Activity_Name = 'Intake Form Re-Triage' 
        THEN 'CRITICAL BOTTLENECK: MISSING PAPERWORK'
        ELSE 'NORMAL TRANSITION'
    END AS Bottleneck_Flag
FROM ordered_events
WHERE Next_Activity_Name IS NOT NULL
GROUP BY 1, 2
ORDER BY Avg_Transition_Wait_Time_Mins DESC;

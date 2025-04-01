function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Calculo fecha'); 
}

function calculateDates(startDate, numDays, center) {
    let HOLIDAYS = {
        TFE: JSON.parse(PropertiesService.getScriptProperties().getProperty('holidays_TFE')) || ["2025-01-01", "2025-01-06", "2025-02-03", "2025-03-04", "2025-04-17", "2025-04-18", "2025-05-01", "2025-05-02", "2025-05-30", "2025-08-15", "2025-11-01", "2025-12-06", "2025-12-08", "2025-12-24", "2025-12-25", "2025-12-31"],
        LPA: JSON.parse(PropertiesService.getScriptProperties().getProperty('holidays_LPA')) || ["2025-01-01", "2025-01-06", "2025-03-04", "2025-04-17", "2025-04-18", "2025-05-01", "2025-05-30", "2025-06-24", "2025-08-15", "2025-09-08", "2025-11-01", "2025-12-06", "2025-12-08", "2025-12-24", "2025-12-25", "2025-12-31"]
    };

    let start = new Date(startDate);
    let naturalEndDate = new Date(start);
    naturalEndDate.setDate(naturalEndDate.getDate() + parseInt(numDays) - 1);

    let workEndDate = calculateWorkingDate(start, parseInt(numDays), HOLIDAYS[center]);

    return {
        startDate: formatDate(start),
        naturalDate: formatDate(naturalEndDate),
        workDate: formatDate(workEndDate),
        numDays: numDays
    };
}

function calculateWorkingDate(startDate, days, holidays) {
    let date = new Date(startDate);
    let daysCounted = 0;
    let dayOfWeek = date.getDay();
    let formattedDate = date.toISOString().split('T')[0];

    if (dayOfWeek !== 0 && dayOfWeek !== 6 && !holidays.includes(formattedDate)) {
        daysCounted = 1;
    }

    while (daysCounted < days) {
        date.setDate(date.getDate() + 1);
        dayOfWeek = date.getDay();
        formattedDate = date.toISOString().split('T')[0];

        if (dayOfWeek !== 0 && dayOfWeek !== 6 && !holidays.includes(formattedDate)) {
            daysCounted++;
        }
    }

    return date;
}

function formatDate(date) {
    let dd = date.getDate().toString().padStart(2, '0');
    let mm = (date.getMonth() + 1).toString().padStart(2, '0');
    let yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
}

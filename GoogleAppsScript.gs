// Google Apps Script Code for Equipment Management
// Deploy this as a Web App with Execute as: Me, Access: Anyone

const SHEET_ID = '1R4NB2WIC0VzTVdYbReQEVXv0sqzwThJx4A50w3e3EAw'; // Replace with your actual sheet ID

function doGet(e) {
  const action = e.parameter.action;
  const sheetName = e.parameter.sheet || 'Overall'; // Default to Overall
  
  try {
    switch(action) {
      case 'getAll':
        return getEquipmentData(sheetName);
      case 'getSheets':
        return getAvailableSheets();
      default:
        return ContentService
          .createTextOutput(JSON.stringify({error: 'Invalid action'}))
          .setMimeType(ContentService.MimeType.JSON);
    }
  } catch(error) {
    return ContentService
      .createTextOutput(JSON.stringify({error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const action = data.action;
  const sheetName = data.sheet || 'Overall'; // Default to Overall
  
  try {
    switch(action) {
      case 'create':
        return createEquipment(data, sheetName);
      case 'update':
        return updateEquipment(data, sheetName);
      case 'delete':
        return deleteEquipment(data, sheetName);
      default:
        return ContentService
          .createTextOutput(JSON.stringify({error: 'Invalid action'}))
          .setMimeType(ContentService.MimeType.JSON);
    }
  } catch(error) {
    return ContentService
      .createTextOutput(JSON.stringify({error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getAvailableSheets() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheets = spreadsheet.getSheets();
    const sheetNames = sheets.map(sheet => sheet.getName());
    
    return ContentService
      .createTextOutput(JSON.stringify(sheetNames))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(error) {
    return ContentService
      .createTextOutput(JSON.stringify({error: 'Failed to get sheets: ' + error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getEquipmentData(sheetName) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      // Try to find a similar sheet name (case-insensitive)
      const allSheets = spreadsheet.getSheets();
      const foundSheet = allSheets.find(s => s.getName().toLowerCase() === sheetName.toLowerCase());
      
      if (foundSheet) {
        // Use the found sheet with the correct case
        return getEquipmentDataFromSheet(foundSheet);
      }
      
      return ContentService
        .createTextOutput(JSON.stringify({error: 'Sheet not found: ' + sheetName}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return getEquipmentDataFromSheet(sheet);
  } catch(error) {
    return ContentService
      .createTextOutput(JSON.stringify({error: 'Failed to get equipment data: ' + error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getEquipmentDataFromSheet(sheet) {
  const data = sheet.getDataRange().getValues();
  
  if (data.length === 0) {
    return ContentService
      .createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  const headers = data[0];
  const equipment = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const item = {};
    
    headers.forEach((header, index) => {
      item[header] = row[index] || '';
    });
    
    // Check if the row has an SI No (first column) and it's not empty
    if (item['SI No'] && item['SI No'] !== '') {
      equipment.push(item);
    }
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(equipment))
    .setMimeType(ContentService.MimeType.JSON);
}

function createEquipment(data, sheetName) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify({error: 'Sheet not found: ' + sheetName}))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const equipment = data.equipment;
    
    // Validate required fields
    const requiredFields = ['Equipment Description/Make', 'Site Location'];
    for (const field of requiredFields) {
      if (!equipment[field] || equipment[field].toString().trim() === '') {
        return ContentService
          .createTextOutput(JSON.stringify({error: `Required field '${field}' cannot be empty`}))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // Get headers
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    // Generate new SI No
    const lastRow = sheet.getLastRow();
    const newSiNo = lastRow; // This will be the next sequential number
    
    // Prepare row data
    const rowData = [];
    headers.forEach(header => {
      if (header === 'SI No') {
        rowData.push(newSiNo);
      } else {
        rowData.push(equipment[header] || '');
      }
    });
    
    // Add the new row
    sheet.appendRow(rowData);
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true, id: newSiNo}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(error) {
    return ContentService
      .createTextOutput(JSON.stringify({error: 'Failed to create equipment: ' + error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function updateEquipment(data, sheetName) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify({error: 'Sheet not found: ' + sheetName}))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const equipment = data.equipment;
    const siNo = equipment['SI No'];
    
    // Find the row with the matching SI No
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    const headers = values[0];
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] == siNo) { // SI No is in the first column
        // Update the row
        headers.forEach((header, index) => {
          if (equipment.hasOwnProperty(header)) {
            sheet.getRange(i + 1, index + 1).setValue(equipment[header]);
          }
        });
        
        return ContentService
          .createTextOutput(JSON.stringify({success: true}))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({error: 'Equipment not found'}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(error) {
    return ContentService
      .createTextOutput(JSON.stringify({error: 'Failed to update equipment: ' + error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function deleteEquipment(data, sheetName) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify({error: 'Sheet not found: ' + sheetName}))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const siNo = data.siNo;
    
    // Find the row with the matching SI No
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] == siNo) { // SI No is in the first column
        sheet.deleteRow(i + 1);
        
        return ContentService
          .createTextOutput(JSON.stringify({success: true}))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({error: 'Equipment not found'}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(error) {
    return ContentService
      .createTextOutput(JSON.stringify({error: 'Failed to delete equipment: ' + error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

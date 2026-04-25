import xlsx from 'xlsx'

const filePath = 'P:/SourceCode-PIVOT/spirospares/public/BOM 450M1V2 with Picture.xlsx'

try {
  const workbook = xlsx.readFile(filePath)
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]
  const data = xlsx.utils.sheet_to_json(sheet, {header: 1})
  
  console.log('Excel raw data (with headers):')
  console.log(JSON.stringify(data, null, 2))
  console.log(`\nTotal rows: ${data.length}`)
  
  // Check for images in the workbook
  console.log('\nChecking for images in workbook...')
  if (workbook.Sheets[sheetName]['!images']) {
    console.log('Found images:', workbook.Sheets[sheetName]['!images'])
  } else {
    console.log('No images found in sheet metadata')
  }
} catch (error) {
  console.error('Error reading Excel file:', error.message)
}

class HtmlElement {
  constructor(name, className = '') {
    this.name = name;
    this.className = className;
  };

  getElement(attributes = {}) {
    const element = document.createElement(this.name);
    element.className = this.className;
    const arrAttributes = Object.entries(attributes);
    arrAttributes.forEach(([nameAttribute, value]) => {
      element.style[nameAttribute] = value;
    });
    return element;
  }
}

const input = document.getElementById('upload-input');

const columns = ['Тиждень', 'Дата', 'Час', 'Виділено часу', 'Теми'];

const columnData = {
    [columns[0]]: [columns[0]],
    [columns[1]]: [columns[1]],
    [columns[2]]: [columns[2]],
    [columns[3]]: [columns[3]],
    [columns[4]]: [columns[4]]
}

const handleFileAsync = async (e) => {
  const file = e.target.files[0];
  const fileReader = new FileReader();
  fileReader.readAsBinaryString(file);
  fileReader.onload = (e) => {
    const data = e.target.result;
    const workbook = XLSX.read(data, {type: 'binary'});
    const arrayData = XLSX
        .utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    arrayData.forEach((data) => {
        columns.forEach((column) => {
            columnData[column].push(data[column] || '');
        })
    })

    const table = document.getElementById('table');

    Object.entries(columnData).forEach(([column, arrayData]) => {
        const columnElement = new HtmlElement('div', 'table__column').getElement();
        arrayData.forEach((data) => {
            const cellElement = new HtmlElement('div', 'table__cell').getElement();
            cellElement.innerText = data;
            columnElement.append(cellElement);
        })
        table.append(columnElement);
    })

    console.log(columnData);
  }
}
input.addEventListener("change", handleFileAsync)

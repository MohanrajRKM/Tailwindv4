
var dropdown = new ej.dropdowns.DropDownList({
    dataSource: ["Pagination", "Virtual Scroll"],
    change: ddChange,
    value: "Pagination",
    width: 250,
})
dropdown.appendTo('#ddlelement');

var grid = new ej.grids.Grid({
    dataSource: window.orderData,
    height: 270,
    allowPaging: true,
    allowSorting: true,
    allowGrouping: true,
    allowResizing: true,
    allowFiltering: true,
    allowPdfExport: true,
    allowReordering: true,
    allowExcelExport: true,
    allowRowDragAndDrop: true,
    showColumnChooser: true,
    groupSettings: { enableLazyLoading: true },
    filterSettings: { type: 'Menu' },
    pageSettings: { pageCount: 8, pageSizes: true },
    editSettings: { allowAdding: true, allowEditing: true, allowDeleting: true, mode: 'Normal' },
    toolbar: ['Add', 'Delete', 'Update', 'Cancel', 'Search', 'ExcelExport', 'PdfExport', 'CsvExport', 'Print', 'ColumnChooser'],
    contextMenuItems: ['AutoFit', 'AutoFitAll', 'SortAscending', 'SortDescending',
        'Copy', 'Edit', 'Delete', 'Save', 'Cancel', 'PdfExport', 'ExcelExport',
        'CsvExport', 'FirstPage', 'PrevPage', 'LastPage', 'NextPage'],
    columns: [
        { width: 60, type: 'checkbox' },
        { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true, textAlign: 'Right', width: 120, validationRules: { required: true }},
        { field: 'CustomerID', headerText: 'Customer ID', width: 120, editType: 'dropdownedit',  },
        { field: 'Freight', headerText: 'Frieght', width: 120, format: 'C2', editType: 'numericedit', textAlign: 'Right' },
        { field: 'OrderDate', headerText: 'Order Date', width: 120, format: 'yMd', editType: 'datepickeredit', textAlign: 'Right' },
        { field: 'ShipCity', headerText: 'Ship City', width: 120, validationRules: { required: true, minLength: 3, maxLength: 20 } },
    ],
    aggregates: [{
        columns: [{
            type: 'Sum',
            field: 'Freight',
            format: 'C2',
            footerTemplate: 'Sum: ${Sum}'
        }]
    },
    {
        columns: [{
            type: 'Average',
            field: 'Freight',
            format: 'C2',
            footerTemplate: 'Average: ${Average}'
        }]
    }],
});
grid.appendTo('#Grid');

    var grouping = new ej.buttons.CheckBox();
    grouping.appendTo('#columnMenu');
    document.getElementById('columnMenu').onclick = function () {
        if (grouping.checked) {
            grid.showColumnMenu = true;
        }
        else {
            grid.showColumnMenu = false;
        }
    };

    var rtl = new ej.buttons.CheckBox();
    rtl.appendTo('#rtl');
    document.getElementById('rtl').onclick = function () {
        if (rtl.checked) {
            grid.enableRtl = true;
        }
        else {
            grid.enableRtl = false;
        }
    };

    var frozen = new ej.buttons.CheckBox();
    frozen.appendTo('#frozen');
    document.getElementById('frozen').onclick = function () {
        if (frozen.checked) {
            grid.frozenColumns = 1;
            grid.frozenRows = 3;
        }
        else {
            grid.frozenColumns = 0;
            grid.frozenRows = 0;
        }
    };

    var theme = new ej.buttons.CheckBox();
    theme.appendTo('#styleToggle');
    var themeLink = document.getElementById('themeStylesheet');

    document.getElementById('styleToggle').onclick = function () {
        if (theme.checked) {
            themeLink.href = 'tailwind4-dark.css'; // Use the correct file extension
        } else {
            themeLink.href = 'tailwind4.css';
        }
    };

    var checkBoxObj = new ej.buttons.CheckBox({ change: onBiggerChange });
        checkBoxObj.appendTo('#bigger');

    function onBiggerChange(e) {
        e.checked ? document.body.classList.add('e-bigger') : document.body.classList.remove('e-bigger');
        grid.freezeRefresh();
    }

    function ddChange(args) {
        grid.columns.map(x=> x.visible = true);
        if (args.value === "Pagination") {
            grid.setProperties({
                groupSettings: { columns: [] },
                filterSettings: { columns: [] },
                sortSettings: { columns: [] },
                allowPaging: true,
                enableVirtualization: false,
                enableInfiniteScrolling: false,
            }, true)
            // grid.clearGrouping();
        }
        if (args.value === "Virtual Scroll") {
            grid.setProperties({
                groupSettings: { columns: [] },
                filterSettings: { columns: [] },
                sortSettings: { columns: [] },
                allowPaging: false,
                enableVirtualization: true,
                enableInfiniteScrolling: false,
            }, true)
            // grid.clearGrouping();
            grid.gridPager = null;
        }
        grid.freezeRefresh();
    }

    var filtertype = [
        { id: 'Menu', type: 'Menu' },
        { id: 'CheckBox', type: 'Checkbox' },
        { id: 'Excel', type: 'Excel' }
    ];

    var dropDownFilterType = new ej.dropdowns.DropDownList({
        dataSource: filtertype,
        fields: { text: 'type', value: 'id' },
        value: 'Menu',
        change: function (e) {
            var dropSelectedValue = e.value;
            grid.filterSettings.type = dropSelectedValue;
            grid.clearFiltering();
            var propertyTbody = document.querySelector('#property tbody');
            var enableInfiniteLoad;
            if (dropSelectedValue === 'Excel' || dropSelectedValue === 'CheckBox') {
                if (propertyTbody.children.length < 2) {
                    var temp = document.getElementsByTagName("template")[0];
                    var cloneTemplate = temp.content.cloneNode(true);
                    propertyTbody.appendChild(cloneTemplate.querySelector("tr.infinite-row"));
                    enableInfiniteLoad = new ej.buttons.CheckBox({
                        change: function(e) {
                            grid.filterSettings.enableInfiniteScrolling = e.checked;
                        }
                    });
                    enableInfiniteLoad.appendTo('#dataloadtype');
                } else {
                    enableInfiniteLoad = document.getElementById('dataloadtype').ej2_instances[0];
                    enableInfiniteLoad.checked = false;
                    grid.filterSettings.enableInfiniteScrolling = false;
                }
            } else {
                grid.filterSettings.enableInfiniteScrolling = false;
                ej.base.remove(document.querySelector('#property tbody tr.infinite-row'));
            }
        }
    });
    dropDownFilterType.appendTo('#filtertype');

  

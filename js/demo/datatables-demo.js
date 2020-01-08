// Call the dataTables jQuery plugin
$(document).ready(function() {
  const table = $('#dataTable').DataTable({
    columns: [
      {data: 'HOME'},
      {data: 'AWAY'},
      {data: 'G0_15'},
      {data: 'G15_30'},
      {data: 'G30_45'},
      {data: 'G45_60'},
      {data: 'G60_75'},
      {data: 'G75_90'}
    ]
  });

  const getGoalsData = string => string.split(';').slice(2).map(x => parseInt(x));

  const gColumns = [
    'G0_15',
    'G15_30',
    'G30_45',
    'G45_60',
    'G60_75',
    'G75_90'
  ];

  $.ajax({
    url: 'http://soccerdatastats.com/services/api.php/records/PARTIDOS?filter=FECHA,ge,20200108',
    dataType: 'json',
    success: json => {
      const records = [];
      for (let i = 0; i < json.records.length; i++) {
        const record = json.records[i];
        const home = getGoalsData(json.records[i].goles_home_total_MARCADOS);
        const away = getGoalsData(json.records[i].goles_away_total_MARCADOS);
        for (let j = 0; j < gColumns.length; j++) {
          record[gColumns[j]] = home[j] + away[j];
        }
        records.push(record);
      }
      table.rows.add(records).draw();
    }
  });
});

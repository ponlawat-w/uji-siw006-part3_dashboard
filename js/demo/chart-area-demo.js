// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

$(document).ready(() => {
  var ctx = document.getElementById("myAreaChart");
  var myLineChart;

  const createDataset = (stringDataOrArray, label, color) => {
    const data = typeof stringDataOrArray === 'string' ?
      stringDataOrArray.split(';').slice(2).map(x => parseInt(x)) : stringDataOrArray;
    return {
      label: label,
      lineTension: 0.3,
      backgroundColor: color,
      borderColor: color,
      pointRadius: 5,
      pointBackgroundColor: color,
      pointBorderColor: color,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: color,
      pointHitRadius: 50,
      pointBorderWidth: 2,
      data: data,
      fill: false
    };
  };

  const generateCharts = datasets => {
    const max = Math.max(...datasets.map(d => d.data).flat(), 15);

    myLineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [
          '0-15',
          '15-30',
          '30-45',
          '45-60',
          '60-75',
          '75-90+'
        ],
        datasets: datasets,
      },
      options: {
        scales: {
          xAxes: [{
            time: {
              unit: 'date'
            },
            gridLines: {
              display: false
            },
            ticks: {
              maxTicksLimit: 7
            }
          }],
          yAxes: [{
            ticks: {
              min: 0,
              max: max,
              maxTicksLimit: 5
            },
            gridLines: {
              color: "rgba(0, 0, 0, .125)",
            }
          }],
        },
        legend: {
          display: true
        }
      }
    });
  };

  $.ajax({
    url: 'http://soccerdatastats.com/services/api.php/records/PARTIDOS?filter=ID,eq,8537974',
    dataType: 'json',
    success: json => {
      const datasets = [
        createDataset(json.records[0].goles_home_total_MARCADOS, 'Home', 'rgb(54, 162, 235)'),
        createDataset(json.records[0].goles_away_total_MARCADOS, 'Away', 'rgb(255, 99, 132)')
      ];

      const totalData = [];
      for (let i = 0; i < datasets[0].data.length; i++) {
        totalData.push(datasets[0].data[i] + datasets[1].data[i]);
      }
      datasets.push(createDataset(totalData, 'Total', 'rgb(153, 102, 255)'));

      generateCharts(datasets);
    }
  });
});

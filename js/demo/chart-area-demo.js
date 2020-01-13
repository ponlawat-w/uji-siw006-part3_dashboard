// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

$(document).ready(() => {
  var ctx = document.getElementById("myAreaChart");
  var myLineChart;

  const getUrlParams = () => {
    let search = window.location.search;
    if (!search) {
      return {};
    }
    search = search.substring(1);
    const obj = {};
    $.each(search.split('&'), (idx, paramStr) => {
      const paramStrSplited = paramStr.split('=');
      if (paramStrSplited.length < 2) {
        return;
      }

      obj[decodeURIComponent(paramStrSplited[0])] = decodeURIComponent(paramStrSplited[1]);
    });

    return obj;
  };

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
    const maxGoal = Math.max(...datasets.map(d => d.data).flat());
    let max = Math.round(maxGoal * 1.2);
    max = Math.max(max - (max % 5), maxGoal);

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

  const urlParams = getUrlParams();

  $.ajax({
    url: `http://soccerdatastats.com/services/api.php/records/PARTIDOS?filter=ID,eq,${urlParams.id}`,
    dataType: 'json',
    success: json => {
      $('#team-names').html(`${json.records[0].HOME} - ${json.records[0].AWAY}`);

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

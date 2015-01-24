$(document).ready(function() {
		$('#group_size_input').val(2); // display 2 by default

		// draw chart, and passing options asked by Chart.js
				var ctx = document.getElementById("myChart").getContext("2d");

				var options = 
				{

				    ///Boolean - Whether grid lines are shown across the chart
				    scaleShowGridLines : true,

				    //String - Colour of the grid lines
				    scaleGridLineColor : "rgba(0,0,0,.05)",

				    //Number - Width of the grid lines
				    scaleGridLineWidth : 1,

				    //Boolean - Whether to show horizontal lines (except X axis)
				    scaleShowHorizontalLines: true,

				    //Boolean - Whether to show vertical lines (except Y axis)
				    scaleShowVerticalLines: true,

				    //Boolean - Whether the line is curved between points
				    bezierCurve : true,

				    //Number - Tension of the bezier curve between points
				    bezierCurveTension : 0.4,

				    //Boolean - Whether to show a dot for each point
				    pointDot : true,

				    //Number - Radius of each point dot in pixels
				    pointDotRadius : 4,

				    //Number - Pixel width of point dot stroke
				    pointDotStrokeWidth : 1,

				    //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
				    pointHitDetectionRadius : 20,

				    //Boolean - Whether to show a stroke for datasets
				    datasetStroke : true,

				    //Number - Pixel width of dataset stroke
				    datasetStrokeWidth : 2,

				    //Boolean - Whether to fill the dataset with a colour
				    datasetFill : true,

				    //String - A legend template
				    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

				};

				var data = {
					labels: ["Sharing  /  Not Sharing"],
				    datasets: [
				        {
				            label: "Sharing a Birthday",
				            fillColor: "rgba(190,190,190,0.5)",
				            strokeColor: "rgba(220,220,220,0.8)",
				            highlightFill: "rgba(180,180,180,0.75)",
				            highlightStroke: "rgba(220,220,220,1)",
				            data: [0]
				        },
				        {
				            label: "Not Sharing a Birthday",
				            fillColor: "rgba(151,187,205,0.5)",
				            strokeColor: "rgba(151,187,205,0.8)",
				            highlightFill: "rgba(151,187,205,0.75)",
				            highlightStroke: "rgba(151,187,205,1)",
				            data: [100]
				        }
				    ]
				};

				var myBarChart = new Chart(ctx).Bar(data, options);

		// making sure the input of the group size is valid
		$('#group_size_input').blur(function() {
			var group_input = $(this).val();

			if (group_input.length == 0 || /\./.test(group_input) || group_input < 2 || group_input > 100)
			{
				$('#generate_table_btn').addClass('disabled'); // and add popover
				$('#group_size_input').css('background', 'red').css('color', 'white'); 
			}
			else
			{
				$('#generate_table_btn').removeClass('disabled');
				$('#group_size_input').css('background', 'white').css('color', 'black');
			}
		});

		$('#generate_table_btn').click(function () {

			if (!$(this).hasClass('disabled')) {

				// function to calculate probability given the input from the user
				var probs_array = calculateProb(parseInt($('#group_size_input').val()), $('#bissextile_input').is(':checked'));

				myBarChart.datasets[0].bars[0].value = probs_array[0];
				myBarChart.datasets[1].bars[0].value = probs_array[1];
				myBarChart.update();
				// Calling update now animates the position of March from 90 to 50.
			}
		});

		$("input[type=number]").bind('keyup input', function(){
			if (!$('#generate_table_btn').hasClass('disabled')) {

				// function to calculate probability given the input from the user
				var probs_array = calculateProb(parseInt($('#group_size_input').val()), $('#bissextile_input').is(':checked'));

				myBarChart.datasets[0].bars[0].value = probs_array[0];
				myBarChart.datasets[1].bars[0].value = probs_array[1];
				myBarChart.update();
				// Calling update now animates the position of March from 90 to 50.
			}
		});
	});

	function calculateProb(group_input_param, bissextile) {
		var days_in_year = 365;

		if(bissextile)
			days_in_year = 366;

		// probability that no one shares a Birthday
		var not_shared_prob = 1;

		// the actual calculation
		for (var i = 0, numerator = days_in_year; i < group_input_param; i++, numerator--)
			not_shared_prob *= numerator / days_in_year;

		// in percentage
		not_shared_prob *= 100;
		not_shared_prob = Math.round(not_shared_prob);


		// all the other cases therefore share at least one birthday
		var shared_prob = Math.round(100 - not_shared_prob);

		return [shared_prob, not_shared_prob];
	}
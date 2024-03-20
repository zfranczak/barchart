document.addEventListener('DOMContentLoaded', () => {
  fetch(
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
  )
    .then((response) => response.json())
    .then((data) => {
      const dataset = data.data;

      const w = 920;
      const h = 500;
      const padding = 50;
      const barWidth = (w - 2 * padding) / dataset.length;

      // Create an SVG element
      const svg = d3
        .select('.chart')
        .append('svg')
        .attr('width', w)
        .attr('height', h);

      // Define tooltip
      const tooltip = d3
        .select('.chart')
        .append('div')
        .attr('id', 'tooltip')
        .style('opacity', 0);

      let years = dataset.map(function (dataPoint) {
        let quarter;
        let year = dataPoint[0].substring(0, 4);
        let q = dataPoint[0].substring(5, 7);

        if (q === '01') {
          quarter = 'Q1';
        } else if (q === '04') {
          quarter = 'Q2';
        } else if (q === '07') {
          quarter = 'Q3';
        } else if (q === '10') {
          quarter = 'Q4';
        }

        return year + ' ' + quarter;
      });

      // Create a time scale for x-coordinate
      const xScale = d3
        .scaleTime()
        .domain([
          new Date(dataset[0][0]), // First date in the dataset
          new Date(dataset[dataset.length - 1][0]), // Last date in the dataset
        ])
        .range([padding, w - padding]);

      // Create a linear scale for y-coordinate
      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(dataset, (d) => d[1])])
        .range([h - padding, padding]);

      // Create bars
      svg
        .selectAll('rect')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('data-date', (d) => d[0])
        .attr('data-gdp', (d) => d[1])
        .attr('x', (d, i) => xScale(new Date(d[0])))
        .attr('y', (d) => yScale(d[1]))
        .attr('width', w / dataset.length)
        .attr('height', (d) => h - padding - yScale(d[1]))
        .attr('fill', '#16d569')
        .attr('class', 'bar')
        .attr('index', (d, i) => i) // Add index attribute
        .on('mouseover', function (event, d) {
          var i = this.getAttribute('index');

          tooltip.transition().duration(200).style('opacity', 0.9);

          tooltip
            .html(
              years[i] +
                '<br>' +
                '$' +
                d[1].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') +
                ' Billion'
            )
            .attr('data-date', d[0])
            .style('left', i * barWidth + 30 + 'px')
            .style('top', h - 100 + 'px')
            .style('transform', 'translateX(60px)');
        })
        .on('mouseout', function () {
          tooltip.transition().duration(200).style('opacity', 0);
        });

      // Add x-axis
      svg
        .append('g')
        .attr('transform', `translate(0, ${h - padding})`)
        .attr('id', 'x-axis')
        .attr('class', 'tick')
        .call(d3.axisBottom(xScale));

      // Add y-axis
      svg
        .append('g')
        .attr('transform', `translate(${padding}, 0)`)
        .attr('id', 'y-axis')
        .attr('class', 'tick')
        .call(d3.axisLeft(yScale));

      // Add title to the chart
      svg
        .append('text')
        .attr('id', 'title')
        .attr('x', w / 2)
        .attr('y', 30)
        .attr('text-anchor', 'middle')
        .style('font-size', '24px')
        .text(data.source_name);

      // Add URL to the chart
      svg
        .append('text')
        .attr('id', 'data-url')
        .attr('x', w / 2)
        .attr('y', h)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .text(data.display_url);
      // Add Axes Names
    });
});

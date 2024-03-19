document.addEventListener('DOMContentLoaded', () => {
  fetch(
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
  )
    .then((response) => response.json())
    .then((data) => {
      const dataset = data.data;

      const w = 1000;
      const h = 500;
      const padding = 50;

      // Create an SVG element
      const svg = d3
        .select('body')
        .append('svg')
        .attr('width', w)
        .attr('height', h);

      // Add title to the chart
      svg
        .append('text')
        .attr('id', 'title')
        .attr('x', w / 2)
        .attr('y', 30)
        .attr('text-anchor', 'middle')
        .style('font-size', '24px')
        .text(data.source_name);

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
        .attr('x', (d, i) => xScale(new Date(d[0])))
        .attr('y', (d, i) => yScale(d[1]))
        .attr('width', w / dataset.length)
        .attr('height', (d, i) => h - padding - yScale(d[1]))
        .attr('fill', 'red')
        .attr('class', 'bar')
        .append('title')
        .text((d) => d[1]);

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
    });
});

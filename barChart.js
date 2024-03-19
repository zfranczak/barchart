document.addEventListener('DOMContentLoaded', () => {
  fetch(
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
  )
    .then((response) => response.json())
    .then((data) => {
      const dataset = data.data;

      const w = 1000;
      const h = 500;

      // Create an SVG element
      const svg = d3
        .select('body')
        .append('svg')
        .attr('width', w)
        .attr('height', h);

      // Create a time scale for x-coordinate
      const xScale = d3
        .scaleTime()
        .domain([
          new Date(dataset[0][0]), // First date in the dataset
          new Date(dataset[dataset.length - 1][0]), // Last date in the dataset
        ])
        .range([0, w]);

      // Create a linear scale for y-coordinate
      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(dataset, (d) => d[1])])
        .range([h, 0]);

      // Create bars
      svg
        .selectAll('rect')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('x', (d, i) => xScale(new Date(d[0])))
        .attr('y', (d, i) => yScale(d[1]))
        .attr('width', w / dataset.length)
        .attr('height', (d, i) => h - yScale(d[1]))
        .attr('fill', 'navy');

      // Add x-axis
      svg
        .append('g')
        .attr('transform', `translate(0, ${h})`)
        .call(d3.axisBottom(xScale));

      // Add y-axis
      svg.append('g').call(d3.axisLeft(yScale));
    });
});

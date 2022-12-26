(function (d3) {
  'use strict';

  const svg = d3.select('svg');
  const width = document.body.clientWidth;
  const height = document.body.clientHeight;

  const margin = { top: 200, right: 150, bottom: 100, left: 250};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const treeLayout = d3.tree().size([innerHeight, innerWidth]);

  const zoomG = svg
      .attr('width', width)
      .attr('height', height)
    .append('g');

  const g = zoomG.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
  
  var tooltip = d3.select('.tips')
  .append('div')
  .attr('id','tooltip')
  .style('opacity',0);
  
   var overlay = d3.select('.tips')
   .append('div')
    .attr('class', 'overlay')
    .style('opacity', 0);

  d3.json('data.json')
    .then(data => {
      const root = d3.hierarchy(data);
      const links = treeLayout(root).links();
      const linkPathGenerator = d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x);
    
      g.selectAll('path').data(links)
        .enter().append('path')
          .attr('d', linkPathGenerator);
    
      g.selectAll('text').data(root.descendants())
        .enter().append('text')
          .attr('x', d => d.y)
          .attr('y', d => d.x)
          .attr('dy', '0.32em')
          .attr('text-anchor', d => d.children ? 'middle' : 'start')
          .attr('font-size', d => 3.25 - d.depth + 'em')
          .text(d => d.data.data.id)
          .on('click',function(){
            tooltip.transition()
            .duration(200)
            .style('opacity',1);
            tooltip.html('Some Sort of Dashboard like the Health Monitor')
            .style('left',100 + 'px')
            .style('top',100 + 'px')
            .style('padding', 20 + 'px')
          })
            .on('mouseout',function(){
            tooltip.transition()
            .duration(200)
            .style('opacity',0);
            overlay.transition()
                .duration(200)
                .style('opacity', 0);
          });
    });

}(d3));


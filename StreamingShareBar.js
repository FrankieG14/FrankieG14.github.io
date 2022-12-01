function main() {
    let xLabels = [
        'Spotify',
        'Apple Music',
        'Amazon',
        'Tencent Music',
        'Google',
        'Netease',
        'Other'
    ];
    let svg = d3.select('svg'),
        margin = { top: 60, bottom: 60, left: 80, right: 200 },
        width = svg.attr('width') - margin.left - margin.right,
        height =
            svg.attr('height') - margin.top - margin.bottom;

    //Add Scales
    let xScale = d3
            .scaleBand()
            .range([margin.left, margin.left + width])
            .padding(0.45),
        yScale = d3
            .scaleLinear()
            .range([height + margin.top, margin.top]),
        colorScale = d3
            .scaleOrdinal()
            .range(['#4daf4a', '#f94c57','#808080','#00A8E1','#3458b0','#F4B400','#bebada']);

    //Add Tooltip
    var div = d3
        .select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    //Decimal number format
    var formatDecimal = d3.format(',.2f');

    //Read Data
    d3.csv('StreamingShare_CS360Final.csv', (d) => {
        return {
            code: d['Company'],
            horsepower: +d['Percentage'],
        };
    }).then((dataset) => {
        let data = [];
        dataset.forEach((elem) => {
            if (xLabels.includes(elem.code)) {
                data.push(elem);
            }
        });
        data.sort((b, a) => a.horsepower - b.horsepower);
        let xSeq = [];
        data.forEach((elem) => xSeq.push(elem.code));

        xScale.domain(xSeq);
        yScale.domain([d3.min(data, (d) => d.horsepower) - 4, d3.max(data, (d) => d.horsepower)]);
        colorScale.domain([
            "Spotify", "Apple Music", "Amazon", "Tencent Music", "Google", "Netease", "Other"
        ])

        //Add Graph
        svg
            .selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('x', (d) => xScale(d.code))
            .attr('y', (d) => yScale(d.horsepower))
            .attr('width', xScale.bandwidth())
            .attr(
                'height',
                (d) => height + margin.top - yScale(d.horsepower)
            )
            .attr('fill', (d) => colorScale(d.horsepower))
            .on('mouseover', function (event, d) {
                div
                    .transition()
                    .duration(200)
                    .style('opacity', 0.9);
                div
                    .html(
                        d.code +
                        ': ' +
                        formatDecimal(d.horsepower) + '%'
                    )
                    .style('left', event.pageX + 'px')
                    .style('top', event.pageY - 28 + 'px');
            })
            .on('mouseout', function (d) {
                div.transition().duration(500).style('opacity', 0);
            })
            .on('mousemove', function (event, d) {
                div
                    .transition()
                    .duration(200)
                    .style('opacity', 0.9);
                div
                    .html(
                        d.code +
                        ': ' +
                        formatDecimal(d.horsepower) + '%'
                    )
                    .style('left', event.pageX + 'px')
                    .style('top', event.pageY - 28 + 'px');
            })
            .on('mouseout', function (d) {
                div.transition().duration(500).style('opacity', 0);
            });;

        //Add Title
        svg
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('x', width / 2 + margin.left)
            .attr('y', margin.top / 2)
            .style("font-size", "24px")
            .text('Overall Platform Streaming Share');

        //X Axis
        svg
            .append('g')
            .attr('class', 'axis')
            .attr(
                'transform',
                'translate(0, ' + (height + margin.top) + ')'
            )
            .call(d3.axisBottom(xScale).tickValues(xLabels))
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('x', width / 2 + margin.left)
            .attr('y', margin.bottom / 2 + 10)
            .style("font-size", "18px")
            .text('Platform');

        //Y Axis
        svg
            .append('g')
            .attr('class', 'axis')
            .attr(
                'transform',
                'translate(' + margin.left + ', 0)'
            )
            .call(
                d3
                    .axisLeft(yScale)
                    .ticks(5)
                    .tickFormat(d3.format('~s'))
            )
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2 - margin.top)
            .attr('y', -margin.left / 2 + 3)
            .style("font-size", "18px")
            .text(
                'Percentage'
            );



        // //Add Legend
        // let legend = d3
        //     .legendColor()
        //     .labelFormat(d3.format('.2s'))
        //     .title('Percentage of Streaming Share')
        //     .scale(colorScale);
        // svg
        //     .append('g')
        //     .attr('class', 'legend')
        //     .attr(
        //         'transform',
        //         'translate(' +
        //         (width + margin.left + margin.right / 5) +
        //         ',' +
        //         (height - margin.bottom) / 2 +
        //         ')'
        //     )
        //     .call(legend);
    });
}

main();

import React from 'react';
import WordCloud from 'react-d3-cloud';
import data from "./data.json";
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';

const schemeCategory10ScaleOrdinal = scaleOrdinal(schemeCategory10);

function WordCloudChart() {
    const newData = data.map((item) => ({
        text: item.text,
        value: Math.random() * 1000
    }));
    return (
        <WordCloud
            data={newData}
            width={500}
            height={500}
            font="Times"
            fontStyle="italic"
            fontWeight="bold"
            fontSize={(word) => Math.log2(word.value) * 5}
            spiral="rectangular"
            rotate={(word) => word.value % 360}
            padding={5}
            random={Math.random}
            fill={(d, i) => schemeCategory10ScaleOrdinal(i)}
            onWordClick={(event, d) => {
                console.log(`onWordClick: ${d.text}`);
            }}
            onWordMouseOver={(event, d) => {
                console.log(`onWordMouseOver: ${d.text}`);
            }}
            onWordMouseOut={(event, d) => {
                console.log(`onWordMouseOut: ${d.text}`);
            }}
        />
    );
}

export default WordCloudChart;

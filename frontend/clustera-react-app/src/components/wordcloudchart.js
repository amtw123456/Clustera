import React from 'react';
import WordCloud from 'react-d3-cloud';
import data from "./data.json";

const fontSize = (word) => word.value / 20;
const rotate = (word) => (word.value % 90) - 45;

function MyWordCloud() {
    const newData = data.map((item) => ({
        text: item.text,
        value: Math.random() * 1000
    }));
    return (
        <WordCloud
            width={1000}
            height={750}
            data={newData}
            fontSize={fontSize}
            rotate={rotate}
            padding={2}
        />
    );
}

export default MyWordCloud;

import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import * as stats from 'simple-statistics';
import styles from './StatsTable.module.css';

const StatsCalculator = () => {
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/wine.csv');
      const data = await response.text();

      const columnStatistics = {};

      Papa.parse(data, {
        header: true,
        dynamicTyping: true,
        step: (result) => {
          for (const column in result.data) {
            if (columnStatistics[column] === undefined) {
              columnStatistics[column] = [];
            }
            const value = result.data[column];
            columnStatistics[column].push(value);
          }
        },
        complete: () => {
          const computedStatistics = {};
          for (const column in columnStatistics) {
            const meanValue = stats.mean(columnStatistics[column]).toFixed(3);
            const medianValue = stats.median(columnStatistics[column]).toFixed(3);
            const modeValue = stats.mode(columnStatistics[column]).toFixed(3);
            computedStatistics[column] = { mean: meanValue, median: medianValue, mode: modeValue };
          }

          setStatistics(computedStatistics);
        },
      });
    };

    fetchData();
  }, []);

  const transposedStatistics = Object.keys(statistics).map((column) => ({
    column,
    ...statistics[column],
  }));

  return (
    <div>
      <h2 className={styles['stats-heading']}>Statistics for All Columns:</h2>
      <table className={styles['stats-table']}>
        <thead>
          <tr>
            <th>Measure</th>
            {transposedStatistics.map(({ column }) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Mean</td>
            {transposedStatistics.map(({ mean }) => (
              <td key={mean}>{mean}</td>
            ))}
          </tr>
          <tr>
            <td>Median</td>
            {transposedStatistics.map(({ median }) => (
              <td key={median}>{median}</td>
            ))}
          </tr>
          <tr>
            <td>Mode</td>
            {transposedStatistics.map(({ mode }) => (
              <td key={mode}>{mode}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default StatsCalculator;

import { useMemo, useState, useEffect } from "react";
import { usePreviousDistinct } from "react-use";
import styled from "styled-components";
import Head from "next/head";
import { useRouter } from "next/router";
import useSWR from "swr";

import {
  format,
  formatISO,
  parseISO,
  isValid,
  isBefore,
  isAfter,
  isSameDay
} from "date-fns";

import fetchApod from "../utils/fetchApod";
import DatePicker from "../components/DatePicker";
import DetailView from "../components/DetailView";

const MIN_DATE = parseISO("1995-06-16");
const MAX_DATE = new Date();

const isDateValid = date =>
  isBefore(date, MAX_DATE) &&
  (isSameDay(date, MIN_DATE) || isAfter(date, MIN_DATE));

const Container = styled.div`
  display: grid;
  grid-gap: 1rem;
  align-items: center;
  justify-content: center;
  max-width: 40rem;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
`;

const formatDate = x => formatISO(x, { representation: "date" });

function HomePage({ data: initialData = {}, error }) {
  const FORMAT = "M/d/yyyy";
  const router = useRouter();
  const { query } = router;

  const date = useMemo(() => {
    let result = new Date();

    try {
      const parsedDate = parseISO(query.date);
      if (isValid(parsedDate)) {
        result = parsedDate;
      }
    } catch (err) {}

    return result;
  }, [query.date]);

  const [dateField, setDateField] = useState(date);
  useEffect(() => {
    try {
      setDateField(format(parseISO(query.date), FORMAT));
    } catch (err) {}
  }, [query.date]);

  const goToDate = date => {
    try {
      if (!date instanceof Date) {
        date = parseISO(date);
      }

      if (isDateValid(date)) {
        const url = date ? `/?date=${formatDate(date)}` : "/";
        router.push(url, url, {
          shallow: true
        });
      }
    } catch (err) {}
  };

  const { data: fetchedData } = useSWR(formatDate(date), fetchApod, {
    initialData:
      initialData && (!date || initialData.date === formatDate(date))
        ? initialData
        : null
  });
  const previousData = usePreviousDistinct(fetchedData);
  const data = fetchedData || previousData;
  const loading = !fetchedData;

  const { title } = data || {};

  return (
    <Container>
      <Head>
        <title>
          {title && `${title} | `}
          NASA Astronomy Picture Viewer
        </title>
      </Head>

      <PageTitle>NASA Astronomy Picture Viewer</PageTitle>

      <DatePicker
        date={date}
        format={FORMAT}
        minDate={MIN_DATE}
        maxDate={MAX_DATE}
        value={dateField}
        isDateValid={isDateValid}
        goToDate={goToDate}
        onDayChange={(date, modifiers, dayPickerInput) => {
          const input = dayPickerInput.getInput();
          const inputValue = input.value.trim();

          if (date) {
            goToDate(date);
          }

          setDateField(inputValue);
        }}
      />

      {data && data.msg && <p>{data.msg}</p>}

      {data && !data.msg && <DetailView data={data} loading={loading} />}
    </Container>
  );
}

HomePage.getInitialProps = async ({ query }) => {
  let date = parseISO(query.date);
  date = isDateValid(date) ? date : new Date();
  const isoDate = formatDate(date);

  const data = await fetchApod(isoDate);
  query.date = isoDate;

  return { data };
};

export default HomePage;

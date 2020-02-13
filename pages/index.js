import { useMemo, useState, useEffect } from "react";
import styled from "styled-components";
import Head from "next/head";
import { useRouter } from "next/router";
import useSWR from "swr";

import { format, parseISO, isValid, isBefore, isAfter } from "date-fns";

import fetchApod from "../utils/fetchApod";
import DatePicker from "../components/DatePicker";
import DetailView from "../components/DetailView";

const MIN_DATE = parseISO("1995-06-16");
const MAX_DATE = new Date();

const Container = styled.div`
  display: grid;
  grid-gap: 1rem;
  align-items: center;
  justify-content: center;
  max-width: 40rem;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 1.5rem;
  text-align: center;
`;

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

      if (isBefore(date, MAX_DATE) && isAfter(date, MIN_DATE)) {
        const url = date ? `/?date=${format(date, "yyyy-MM-dd")}` : "/";
        router.push(url, url, {
          shallow: true
        });
      }
    } catch (err) {}
  };

  const { data } = useSWR(query.date, fetchApod, {
    initialData:
      initialData && (!query.date || initialData.date === query.date)
        ? initialData
        : null
  });
  const { title } = data || {};

  return (
    <Container>
      <Head>
        <title>{title} | NASA Astronomy Picture Viewer</title>
      </Head>

      <PageTitle>NASA Astronomy Picture Viewer</PageTitle>

      <DatePicker
        date={date}
        format={FORMAT}
        minDate={MIN_DATE}
        maxDate={MAX_DATE}
        value={dateField}
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

      {error && <p>{error.message}</p>}

      {data && <DetailView data={data} />}
    </Container>
  );
}

HomePage.getInitialProps = async ({ query }) => {
  const data = await fetchApod(query.date);

  if (data.code === 400 || data.code === 500) {
    return { error: { message: data.msg } };
  }

  return { data };
};

export default HomePage;

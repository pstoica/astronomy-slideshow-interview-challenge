import { useMemo, useState, useEffect } from "react";
import fetchApod from "../utils/fetchApod";
import styled from "styled-components";
import Head from "next/head";
import { format, parseISO, isValid, isBefore, isAfter } from "date-fns";
import { useRouter } from "next/router";

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

function HomePage({ data = {}, error }) {
  const FORMAT = "M/d/yyyy";
  const router = useRouter();
  const { query } = router;

  const { title } = data;
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
        router.push({
          pathname: "/",
          query: {
            date: format(date, "yyyy-MM-dd")
          }
        });
      }
    } catch (err) {}
  };

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
  const data = await fetchApod(query);

  if (data.code === 400 || data.code === 500) {
    return { error: { message: data.msg } };
  }

  return { data };
};

export default HomePage;

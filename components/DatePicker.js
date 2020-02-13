import { DateUtils } from "react-day-picker";
import DayPickerInput from "react-day-picker/DayPickerInput";
import styled from "styled-components";

import { parse, format, addDays } from "date-fns";

const Container = styled.div`
  background: black;
  text-align: center;

  button {
    font-family: inherit;
    font-size: 0.8rem;
    opacity: 0.8;
    background: transparent;
    border: 0;
    color: white;
    cursor: pointer;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  input {
    font-family: inherit;
    font-size: 1.2rem;
    width: 150px;
    text-align: center;
    background: black;
    color: white;
    border: 0;
    border-bottom: 1px dotted white;
  }

  .DayPickerInput-Overlay {
    left: 50%;
    transform: translateX(-50%);
  }

  .DayPicker {
    background-color: black;
  }

  .DayPicker-Day {
    background-color: black;
    color: white;

    &:hover {
      background-color: white;
      color: black;
    }

    &--outside:hover {
      background: black;
    }

    &--disabled {
      opacity: 0.5;

      &:hover {
        background: black;
        color: white;
      }
    }
  }
`;

const OffsetButton = ({ date, offset, onClick, children, isDateValid }) => {
  const newDate = addDays(date, offset);
  const isValid = isDateValid(date);

  return (
    <button onClick={() => onClick(newDate)} type="button" disabled={!isValid}>
      {offset < 0 && "‹ "}
      {children} {format(newDate, "M/d")}
      {offset > 0 && " ›"}
    </button>
  );
};

function parseDate(str, format, locale) {
  const parsed = parse(str, format, new Date(), { locale });

  if (DateUtils.isDate(parsed)) {
    return parsed;
  }

  return undefined;
}

function formatDate(date, formatString, locale) {
  return format(date, formatString, { locale });
}

function DatePicker({
  date,
  value,
  minDate,
  maxDate,
  onDayChange,
  isDateValid,
  goToDate,
  format
}) {
  const offsetButtonProps = {
    date,
    minDate,
    maxDate,
    isDateValid,
    onClick: goToDate
  };
  return (
    <Container>
      <form
        onSubmit={e => {
          e.preventDefault();
          goToDate(value);
        }}
      >
        <OffsetButton {...offsetButtonProps} offset={-1} />

        <DayPickerInput
          formatDate={formatDate}
          parseDate={parseDate}
          format={format}
          dayPickerProps={{
            disabledDays: {
              before: minDate,
              after: maxDate
            }
          }}
          value={value}
          onDayChange={onDayChange}
          keepFocus={false}
        />

        <OffsetButton {...offsetButtonProps} offset={1} />
      </form>
    </Container>
  );
}

export default DatePicker;

import styled from "styled-components";
import Player from "react-player";

const Container = styled.div`
  display: grid;
  grid-gap: 1rem;
  align-items: center;
  justify-content: center;

  img {
    margin: 0 auto;
    max-width: 100%;
    height: auto;
  }
`;

const Title = styled.h1`
  font-weight: bold;
  font-size: 1.3rem;
  font-style: italic;

  small {
    font-weight: normal;
    opacity: 0.7;
  }
`;

const Explanation = styled.p`
  line-height: 1.5;
  font-weight: lighter;
`;

const Copyright = styled.div`
  font-size: 0.8rem;
  opacity: 0.7;
`;

function DetailView({
  data: {
    copyright,
    date,
    explanation,
    hdurl: hdUrl,
    media_type: mediaType,
    title,
    url
  }
}) {
  return (
    <Container key={date}>
      {mediaType === "image" && (
        <a href={hdUrl} target="_blank" rel="noopener nofollow">
          <img src={url} title={title} alt={explanation} />
        </a>
      )}

      {mediaType === "video" && <Player url={url} />}

      <Title>{title}</Title>

      <Explanation>{explanation}</Explanation>

      {copyright && <Copyright>Copyright {copyright}</Copyright>}
    </Container>
  );
}

export default DetailView;

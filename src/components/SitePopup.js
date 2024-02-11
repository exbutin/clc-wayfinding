import { useState, useEffect, useRef } from "react";
import { Button, Card, Collapse } from "react-bootstrap";
import { X, ChevronDoubleUp, ChevronDoubleDown } from "react-bootstrap-icons";
import FabPopupContent from "./FabPopupContent";
import DefaultPopupContent from "./DefaultPopupContent";
import { useDispatch, useSelector } from "react-redux";
import { clearActiveSymbol } from "../redux/Actions";
import styled from "styled-components";

const OuterContainer = styled.div`
  position: fixed;
  bottom: 0;
  start: 0;
  end: 0;
  width: 150%; // make the div 150% of the screen width
  z-index: 3;
  padding-top: 1rem; // add padding to the top of the OuterContainer
  overflow: visible; // ensure the button is not hidden
  transform: translateX(-16.75%);
`;

const StyledCard = styled(Card)`
  position: relative;
  padding: 1rem;
  margin-bottom: 0;
  padding-bottom: 0;
  max-width: 100%; // ensure the card is not wider than its container
  border-radius: 0;
  border: none;
  z-index: 6;
  box-shadow: ${({ shadow }) =>
    shadow ? "1px 1px 1px 1px rgba(0, 0, 0, 0.1)" : "none"};
`;

const CardContainer = styled.div`
  position: relative;
  width: 67.5%; // make the container 80% of the width of the StyledTopDiv
  margin: 0 auto; // center the container within the StyledTopDiv
`;

const StyledContent = styled.div`
  overflow: auto;
  max-height: 50vh;
  margin-bottom: 0; // remove bottom margin
  padding: 20px; // remove bottom margin
  padding-top: 0; // remove bottom margin
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

const StyledTopDiv = styled.div`
  border-top-left-radius: 50% 50px;
  border-top-right-radius: 50% 50px;
  overflow: hidden;
  position: relative;
`;

const StyledButton = styled(Button)`
  &:focus,
  &:active {
    outline: none;
    box-shadow: none;
    border: none;
  }
`;

function SitePopup({ data }) {
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const [shadow, setShadow] = useState(false);
  const expandedContentRef = useRef(null);
  const nonScrollableContentRef = useRef(null);
  const activeSymbol = useSelector((state) => state.symbols.activeSymbol);

  const handleClose = () => {
    setIsExpanded(false);
    dispatch(clearActiveSymbol());
  };

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop } = expandedContentRef.current;
      setShadow(scrollTop > 1);
    };

    const current = expandedContentRef.current;
    if (current) {
      current.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (current) {
        current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [isExpanded]);

  return (
    activeSymbol && (
      <OuterContainer
        data={data}
        className="d-flex flex-column align-items-stretch"
      >
      <StyledButton
        variant="light"
        className="position-absolute top-0 start-50 translate-middle-x"
        style={{ zIndex: 5 }} // adjust this value as needed
        onClick={() => {
          setIsExpanded(!isExpanded);
        }}
      >
        {isExpanded ? <ChevronDoubleDown /> : <ChevronDoubleUp />}
      </StyledButton>
      <StyledTopDiv style={{ position: "relative", zIndex: 4 }}>
        <CardContainer>
          <StyledCard shadow={shadow} className="bg-light">
            {data && (
              <div>
                <StyledButton
                  variant="light"
                  className="position-absolute"
                  style={{ top: ".75rem", right: ".25rem" }} // adjust these values as needed
                  onClick={handleClose}
                >
                  <X size={20} />
                </StyledButton>
                <h2>{data.name}</h2>
                <p>Section: {data.section}</p>
              </div>
            )}
            {isExpanded && <div ref={nonScrollableContentRef}></div>}
          </StyledCard>
          {isExpanded && (
            <div className="bg-light">
              <Collapse in={isExpanded}>
                <StyledContent ref={expandedContentRef}>
                  {data &&
                    (() => {
                      switch (data.category) {
                        case "fab":
                          return (
                            <FabPopupContent
                              data={data}
                              nonScrollableContentRef={nonScrollableContentRef}
                            />
                          );
                        default:
                          return (
                            <DefaultPopupContent
                              data={data}
                              nonScrollableContentRef={nonScrollableContentRef}
                            />
                          );
                      }
                    })()}
                </StyledContent>
              </Collapse>
            </div>
          )}
        </CardContainer>
      </StyledTopDiv>
    </OuterContainer>
    )
  );
}

export default SitePopup;

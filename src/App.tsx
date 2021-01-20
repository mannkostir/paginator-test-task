import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { observer } from 'mobx-react-lite';
import paginator from './store/store';

const App = observer(() => {
  const sectionsContainer = useRef<HTMLDivElement>(null);

  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement;
    setCurrentSectionIndex(target.tabIndex);
  };

  useEffect(() => {
    const items = sectionsContainer.current?.querySelectorAll(
      '.paginator__item'
    );
    const curr = items?.item(currentSectionIndex - 1) as HTMLButtonElement;
    paginator.changeSection(curr.value);
  }, [currentSectionIndex]);

  useEffect(() => {
    // Temporarily hardcoded
    let stepPx = 51;

    const container = sectionsContainer.current || null;

    if (!container) return;

    container.style.bottom = `-${stepPx * currentPage}px`;
  }, [currentPage]);

  useEffect(() => {
    const intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.setAttribute(
          'visibility',
          entry.isIntersecting ? 'visible' : 'hidden'
        );
      });
    });

    const items = sectionsContainer.current?.querySelectorAll(
      '.paginator__item'
    );

    items?.forEach((item) => {
      intersectionObserver.observe(item);
    });
  }, []);

  const forward = () => {
    let _currentPage: number = currentPage;
    let _currentSectionIndex: number = currentSectionIndex + 1;

    const items = sectionsContainer.current?.querySelectorAll(
      '.paginator__item'
    );

    if (items?.length && _currentSectionIndex > items?.length) {
      _currentPage = 0;
      _currentSectionIndex = 1;
    }

    const curr = items?.item(_currentSectionIndex - 1) as HTMLButtonElement;

    if (
      curr.getAttribute('visibility') === 'hidden' &&
      _currentSectionIndex > 1
    ) {
      _currentPage += 1;
    }

    paginator.changeSection(curr.value);
    setCurrentSectionIndex(_currentSectionIndex);
    setCurrentPage(_currentPage);
  };

  const backwards = () => {
    let _currentPage: number = currentPage;
    let _currentSectionIndex: number = currentSectionIndex - 1;

    const items = sectionsContainer.current?.querySelectorAll(
      '.paginator__item'
    );

    if (items?.length && _currentSectionIndex <= 0) {
      const totalPages = Math.ceil(
        sectionsContainer.current?.clientHeight! / 55
      );

      _currentPage = totalPages;
      _currentSectionIndex = items?.length;
    }

    const curr = items?.item(_currentSectionIndex - 1) as HTMLButtonElement;

    if (curr.getAttribute('visibility') === 'hidden') {
      _currentPage -= 1;
    }

    paginator.changeSection(curr.value);
    setCurrentSectionIndex(_currentSectionIndex);
    setCurrentPage(_currentPage);
  };

  return (
    <div className="app">
      <span style={{ display: 'none' }}>
        width: {dimensions.width}, height: {dimensions.height}
      </span>
      <div className="paginator">
        <div className="paginator__sections">
          <span
            className="paginator__scroll-arrow paginator__scroll-arrow_left"
            onClick={backwards}
          >
            {'<'}
          </span>
          <ul className="paginator__list">
            <div className="paginator__items-container" ref={sectionsContainer}>
              {paginator.sections.map((section, index) => (
                <button
                  className="paginator__item"
                  value={section}
                  onClick={handleClick}
                  key={section}
                  tabIndex={index + 1}
                  aria-checked={paginator.currentSection === section}
                >
                  {section}
                </button>
              ))}
            </div>
          </ul>
          <span
            className="paginator__scroll-arrow paginator__scroll-arrow_right"
            onClick={forward}
          >
            {'>'}
          </span>
        </div>
      </div>
      <section className="content">
        {paginator.content.map((contentItem) => {
          if (contentItem.section === paginator.currentSection) {
            return (
              <div className="content__item" key={contentItem.id}>
                <h2 className="content__heading">{contentItem.title}</h2>
                <p className="content__text">{contentItem.text}</p>
              </div>
            );
          }
          return null;
        })}
      </section>
    </div>
  );
});

export default App;

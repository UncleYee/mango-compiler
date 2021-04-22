import React from 'react';

interface Props {
  title: string;
  jsonPath: string
  pageJsPath: string;
  components: string[];
  common: string;
  STATIC_PATH: string;
}

const Html: React.FC<Props> = (props) => {
  const {
    title = 'TODO TITLE',
    jsonPath,
    pageJsPath,
    components,
    common,
    STATIC_PATH = '',
  } = props; // eslint-disable-line

  return (
    // eslint-disable-next-line jsx-a11y/html-has-lang
    <html>
      <head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <meta name="format-detection" content="telephone=no" />
        <script
          dangerouslySetInnerHTML={{ __html: `window.JSON_PATH="${jsonPath}"` }}
        />
        <style dangerouslySetInnerHTML={{ __html: 'body { margin: 0 }' }} />
      </head>
      <body>
        <div id="root" />
        <div id="modal" />
        <script id="initialContent" type="text/json" dangerouslySetInnerHTML={{ __html: JSON.stringify({}) }} />
        <script src={`${STATIC_PATH}js/lodash.min.js`} crossOrigin="anonymous" />
        <script src={`${STATIC_PATH}js/react.min.js`} crossOrigin="anonymous" />
        <script src={`${STATIC_PATH}js/react-dom.min.js`} crossOrigin="anonymous" />
        <script src={common} crossOrigin="anonymous" />
        {components.map((item, index) => <script key={`component-${index}`} src={item} crossOrigin="anonymous" />)}
        <script src={pageJsPath} crossOrigin="anonymous" />
      </body>
    </html>
  );
};

export default Html;

<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <title><xsl:value-of select="/rss/channel/title"/></title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style>
          body { font-family: system-ui, sans-serif; max-width: 65ch; margin: 2rem auto; padding: 0 1rem; line-height: 1.6; color: #141210; background: #f6f2ea; }
          h1 { font-size: 1.75rem; }
          h2 { font-size: 1.25rem; margin-top: 2rem; }
          a { color: #73420a; }
          .note { border-left: 3px solid #73420a; padding-left: 1rem; }
          time { font-family: ui-monospace, monospace; font-size: 0.9rem; }
        </style>
      </head>
      <body>
        <main>
          <h1><xsl:value-of select="/rss/channel/title"/></h1>
          <p class="note">This is an RSS feed. Copy the address from your browser into a feed reader to follow new posts. <a href="https://aboutfeeds.com">What is a feed?</a></p>
          <p><xsl:value-of select="/rss/channel/description"/></p>
          <p><a><xsl:attribute name="href"><xsl:value-of select="/rss/channel/link"/></xsl:attribute>Back to the site</a></p>
          <xsl:for-each select="/rss/channel/item">
            <article>
              <h2><a><xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute><xsl:value-of select="title"/></a></h2>
              <time><xsl:value-of select="pubDate"/></time>
              <p><xsl:value-of select="description"/></p>
            </article>
          </xsl:for-each>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>

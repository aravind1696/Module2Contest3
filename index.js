const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://github.com/trending/javascript?since=daily');

  const data = await page.evaluate(() => {
    const repos = [];
    const devs = [];

    // Scrape repository data
    document.querySelectorAll('article.Box-row').forEach(repo => {
      const title = repo.querySelector('h1 a').textContent.trim();
      const description = repo.querySelector('p')?.textContent?.trim() || null;
      const stars = repo.querySelector('a.muted-link[href$="/stargazers"]')
                     .textContent.trim().replace(',', '');
      const forks = repo.querySelector('a.muted-link[href$="/network/members"]')
                     .textContent.trim().replace(',', '');
      const link = `https://github.com${repo.querySelector('h1 a').getAttribute('href')}`;
      
      repos.push({ title, description, stars, forks, link });
    });

    // Scrape developer data
    document.querySelectorAll('article.Box-row').forEach(dev => {
      const name = dev.querySelector('h1 span a').textContent.trim();
      const username = dev.querySelector('h1 span a').getAttribute('href').slice(1);
      const popularRepoLink = `https://github.com${dev.querySelector('h1 a').getAttribute('href')}`;
      const popularRepoName = dev.querySelector('h1 a').textContent.trim();
      const avatar = dev.querySelector('img.avatar[src^="https://avatars"]')?.getAttribute('src') || null;

      devs.push({ name, username, popularRepoLink, popularRepoName, avatar });
    });

    return { repositories: repos, developers: devs };
  });

  console.log(JSON.stringify(data));

  await browser.close();
})();

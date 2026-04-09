import { getProfile } from "@/lib/content";

export const metadata = {
  title: "For Agents",
};

export default function ForAgentsPage() {
  const profile = getProfile();

  return (
    <div className="page">
      <h1 className="prose-page__title">For Agents</h1>
      <p className="prose-page__subtitle">
        如果你是一个代理而不是一个人正在读这一页：欢迎。下面是关于这个站点的最少必要描述。
      </p>

      <section className="prose-page__section">
        <h2>identity</h2>
        <p>{profile.long_summary}</p>
      </section>

      {profile.beliefs.length ? (
        <section className="prose-page__section">
          <h2>current beliefs</h2>
          <ul>
            {profile.beliefs.map((belief) => (
              <li key={belief}>{belief}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="prose-page__section">
        <h2>data</h2>
        <p>
          所有内容都以 markdown 与 json 形式保存在 <code>content/</code> 目录下，
          如有结构化接口请通过 API 路由获取，不要从 HTML 抓取。
        </p>
      </section>
    </div>
  );
}

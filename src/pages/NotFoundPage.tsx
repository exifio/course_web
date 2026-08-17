export default function NotFoundPage({ message = '페이지를 찾을 수 없습니다.' }: { message?: string }) {
  return (
    <section>
      <h1>{message}</h1>
      <a href="/">홈으로 돌아가기</a>
    </section>
  );
}

function Privacy() {
  const containerStyle = {
    margin: "60px auto",
    direction: "rtl",
    textAlign: "right",
    maxWidth: "900px",
    padding: "40px 20px",
  };

  const titleStyle = {
    color: "#f97316",
    fontSize: "42px",
    marginBottom: "30px",
  };

  const paragraphStyle = {
    fontSize: "20px",
    lineHeight: "2",
    color: "#4b5563",
    marginBottom: "20px",
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>سياسة الخصوصية</h1>

      <p style={paragraphStyle}>
        في جيل، نحترم خصوصية المستخدمين ونلتزم بحماية معلوماتهم الشخصية.
      </p>

      <p style={paragraphStyle}>
        نقوم بجمع بعض المعلومات الأساسية مثل الاسم والبريد الإلكتروني وتفاصيل الحجز، وذلك بهدف تحسين تجربة المستخدم وتقديم خدمات أفضل.
      </p>

      <p style={paragraphStyle}>
        لن تتم مشاركة المعلومات الشخصية مع أي طرف ثالث دون الحصول على موافقة المستخدم.
      </p>

      <p style={paragraphStyle}>
        باستخدامك لمنصة جيل، فإنك توافق على سياسة الخصوصية وشروط الاستخدام الخاصة بنا.
      </p>
    </div>
  );
}

export default Privacy;

import { useState } from "react";

function UploadImageTest() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert("Chưa chọn ảnh!");
    setLoading(true);

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const res = await fetch("http://localhost:5000/api/images/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
      } else {
        alert("Upload thất bại!");
      }
    } catch (err) {
      console.error("❌ Lỗi upload:", err);
      alert("Lỗi kết nối server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 30, textAlign: "center" }}>
      <h2>🔥 Test Upload Ảnh Lên Firebase</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <br /><br />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Đang upload..." : "Upload"}
      </button>
      {imageUrl && (
        <div style={{ marginTop: 20 }}>
          <p>Upload thành công!</p>
          <img src={imageUrl} alt="Uploaded" width="250" />
        </div>
      )}
    </div>
  );
}

export default UploadImageTest;

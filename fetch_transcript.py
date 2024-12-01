import sys
from youtube_transcript_api import YouTubeTranscriptApi

def fetch_transcript(video_id):
    try:
        # Öncelikle Türkçe, ardından İngilizce transkript deniyoruz
        transcript = None
        languages_to_try = ['tr', 'en']

        for lang in languages_to_try:
            try:
                transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=[lang])
                print(f"Transcript fetched successfully in language: {lang}")
                break  # Başarılı olursa döngüden çık
            except:
                continue  # Bu dilde bulunamadıysa sıradakine geç

        if not transcript:
            raise Exception("No transcript available in Turkish or English.")

        # Transkript metnini birleştir
        transcript_text = " ".join([entry['text'] for entry in transcript])
        return transcript_text

    except Exception as e:
        return f"Error fetching transcript: {str(e)}"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python script.py <video_id>")
        sys.exit(1)

    video_id = sys.argv[1]
    result = fetch_transcript(video_id)
    print(result)

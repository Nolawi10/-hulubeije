from flask import Flask, jsonify, send_from_directory, send_file, request
from flask_cors import CORS
import os
import json
import random
from datetime import datetime


def create_app() -> Flask:
    app = Flask(__name__, static_folder=None)
    CORS(app)

    @app.get("/api/health")
    def health_check() -> tuple[dict, int]:
        return {"status": "ok", "message": "Hulu Be Ije API is running"}, 200

    @app.get("/api/status")
    def api_status() -> tuple[dict, int]:
        return {"api": "online", "frontend": "connected", "google_apis": "simulated"}, 200

    @app.post("/api/gemini/chat")
    def chat_with_gemini():
        try:
            data = request.get_json()
            message = data.get('message', '').lower()
            
            # Mock responses based on keywords
            mock_responses = {
                'hello': 'Hello! I\'m your AI business assistant. How can I help you with your business today?',
                'marketing': 'For marketing, I recommend focusing on social media content, email campaigns, and local SEO. Would you like specific marketing ideas for your business type?',
                'sales': 'To boost sales, consider offering promotions, improving customer service, and analyzing your sales data regularly. What type of business are you running?',
                'caption': 'I can help you create engaging captions! Just describe your product or service, and I\'ll generate catchy social media captions.',
                'business': 'Running a successful business requires good planning, customer focus, and consistent marketing. What specific aspect of business management would you like help with?',
                'help': 'I can help you with: marketing strategies, sales optimization, content creation, business advice, and using the AI Studio features. What do you need assistance with?'
            }
            
            # Find matching response or use default
            response = mock_responses.get(message, 
                f"That's an interesting question about your business! Based on my analysis, I recommend focusing on customer engagement and consistent branding. Could you tell me more about your specific business needs so I can provide more targeted advice?")
            
            return {"response": response}, 200
        except Exception as e:
            return {"error": str(e)}, 500

    @app.post("/api/gemini/caption")
    def generate_caption():
        try:
            data = request.get_json()
            prompt = data.get('prompt', '').lower()
            
            # Mock caption generation
            mock_captions = [
                "🌟 Transform your business with smart solutions! #Innovation #Success",
                "💼 Making business management simple and effective. #HuluBeIje #BusinessTools",
                "🚀 Elevate your brand with AI-powered insights. #SmartBusiness #Growth",
                "📊 Data-driven decisions for maximum impact. #Analytics #BusinessGrowth",
                "🎯 Target your audience with precision marketing. #MarketingStrategy #ROI"
            ]
            
            caption = random.choice(mock_captions)
            if 'product' in prompt:
                caption = f"🛍️ Amazing product alert! Quality meets affordability. #ProductLaunch #MustHave"
            elif 'service' in prompt:
                caption = f"🏆 Premium service that delivers results. Customer satisfaction guaranteed! #ServiceExcellence #Trust"
            
            return {"caption": caption}, 200
        except Exception as e:
            return {"error": str(e)}, 500

    @app.post("/api/gemini/poster")
    def generate_poster():
        try:
            data = request.get_json()
            business_type = data.get('business_type', '').lower()
            product = data.get('product', '').lower()
            theme = data.get('theme', 'modern')
            
            # Mock poster design
            designs = {
                'restaurant': {
                    'layout': 'Hero image of signature dish at top, bold restaurant name below, contact info at bottom',
                    'colors': 'Warm reds and oranges with cream backgrounds',
                    'elements': 'Food photography, elegant typography, location map, QR code for menu'
                },
                'tech': {
                    'layout': 'Clean grid design with app screenshots, feature highlights in columns',
                    'colors': 'Modern blues and whites with accent colors',
                    'elements': 'App interface mockups, benefit icons, download buttons, social proof'
                },
                'fashion': {
                    'layout': 'Full-width model image, brand name overlay, product details sidebar',
                    'colors': 'Monochrome with one bold accent color',
                    'elements': 'Lifestyle photography, brand logo, price points, social media handles'
                }
            }
            
            default_design = {
                'layout': 'Central product image with brand name at top, key features in bullet points, call-to-action at bottom',
                'colors': 'Professional blues and grays with accent colors matching your brand',
                'elements': 'Product imagery, company logo, benefit statements, contact information, website URL'
            }
            
            design = designs.get(business_type, default_design)
            
            return {"poster_design": f"🎨 **Poster Design for {business_type.title()}**\n\n**Layout:** {design['layout']}\n\n**Color Scheme:** {design['colors']}\n\n**Key Elements:** {design['elements']}\n\n**Theme:** {theme.title()} style with professional typography and balanced composition."}, 200
        except Exception as e:
            return {"error": str(e)}, 500

    @app.post("/api/maps/search")
    def search_places():
        try:
            data = request.get_json()
            query = data.get('query', '').lower()
            
            # Mock places data
            mock_places = [
                {
                    'name': f'{query.title()} Center',
                    'address': 'Bole, Addis Ababa, Ethiopia',
                    'rating': 4.5,
                    'types': ['business', 'point_of_interest'],
                    'vicinity': 'Near Bole International Airport'
                },
                {
                    'name': f'Grand {query.title()} Mall',
                    'address': 'Mekane Yesus, Addis Ababa, Ethiopia',
                    'rating': 4.2,
                    'types': ['shopping_mall', 'point_of_interest'],
                    'vicinity': 'Central Business District'
                },
                {
                    'name': f'{query.title()} Plaza',
                    'address': 'Kazanchis, Addis Ababa, Ethiopia',
                    'rating': 4.0,
                    'types': ['establishment', 'point_of_interest'],
                    'vicinity': 'Near National Museum'
                }
            ]
            
            return {"places": mock_places}, 200
        except Exception as e:
            return {"error": str(e)}, 500

    @app.post("/api/maps/directions")
    def get_directions():
        try:
            data = request.get_json()
            origin = data.get('origin', '')
            destination = data.get('destination', '')
            
            # Mock directions
            mock_directions = {
                'routes': [{
                    'legs': [{
                        'start_address': f'{origin}, Addis Ababa, Ethiopia',
                        'end_address': f'{destination}, Addis Ababa, Ethiopia',
                        'distance': {'text': '5.2 km', 'value': 5200},
                        'duration': {'text': '15 mins', 'value': 900},
                        'steps': [
                            {'instruction': f'Head north from {origin}', 'distance': {'text': '1.0 km'}},
                            {'instruction': 'Turn right onto Bole Road', 'distance': {'text': '2.5 km'}},
                            {'instruction': 'Continue straight for 1.7 km', 'distance': {'text': '1.7 km'}},
                            {'instruction': f'Destination will be on your left at {destination}', 'distance': {'text': '0.0 km'}}
                        ]
                    }]
                }],
                'status': 'OK'
            }
            
            return {"directions": mock_directions}, 200
        except Exception as e:
            return {"error": str(e)}, 500

    # Serve React frontend from dist folder
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_frontend(path):
        # Get the absolute path to the dist folder
        dist_folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'dist')
        
        if path != "" and os.path.exists(os.path.join(dist_folder, path)):
            return send_from_directory(dist_folder, path)
        else:
            index_path = os.path.join(dist_folder, 'index.html')
            if os.path.exists(index_path):
                return send_file(index_path)
            else:
                return f"Frontend not built. Dist folder not found at: {dist_folder}", 404

    return app

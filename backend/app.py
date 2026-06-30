from flask import Flask, jsonify, request
from flask_cors import CORS

from supabase_client import get_supabase

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

TABLE_NAME = "items"

ALLOWED_TABLES = {
    "items": {"order_by": "created_at", "desc": True},
    "categories": {"order_by": "created_at", "desc": True},
}


def _get_table_config(table_name: str):
    if table_name not in ALLOWED_TABLES:
        return None
    return ALLOWED_TABLES[table_name]


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "flask-supabase-api"})


@app.route("/api/items", methods=["GET"])
def list_items():
    try:
        supabase = get_supabase()
        response = supabase.table(TABLE_NAME).select("*").order("created_at", desc=True).execute()
        return jsonify({"data": response.data})
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@app.route("/api/items", methods=["POST"])
def create_item():
    payload = request.get_json(silent=True) or {}
    title = (payload.get("title") or "").strip()
    description = (payload.get("description") or "").strip()

    if not title:
        return jsonify({"error": "title is required"}), 400

    try:
        supabase = get_supabase()
        response = (
            supabase.table(TABLE_NAME)
            .insert({"title": title, "description": description})
            .execute()
        )
        return jsonify({"data": response.data[0] if response.data else None}), 201
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@app.route("/api/items/<item_id>", methods=["DELETE"])
def delete_item(item_id: str):
    try:
        supabase = get_supabase()
        supabase.table(TABLE_NAME).delete().eq("id", item_id).execute()
        return jsonify({"success": True})
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@app.route("/api/categories", methods=["GET"])
def list_categories():
    try:
        supabase = get_supabase()
        response = (
            supabase.table("categories")
            .select("*")
            .order("created_at", desc=True)
            .execute()
        )
        return jsonify({"data": response.data})
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@app.route("/api/categories", methods=["POST"])
def create_category():
    payload = request.get_json(silent=True) or {}
    name = (payload.get("name") or "").strip()
    description = (payload.get("description") or "").strip()

    if not name:
        return jsonify({"error": "name is required"}), 400

    try:
        supabase = get_supabase()
        response = (
            supabase.table("categories")
            .insert({"name": name, "description": description})
            .execute()
        )
        return jsonify({"data": response.data[0] if response.data else None}), 201
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@app.route("/api/categories/<category_id>", methods=["DELETE"])
def delete_category(category_id: str):
    try:
        supabase = get_supabase()
        supabase.table("categories").delete().eq("id", category_id).execute()
        return jsonify({"success": True})
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@app.route("/api/tables", methods=["GET"])
def list_tables():
    try:
        supabase = get_supabase()
        tables = []
        for name, config in ALLOWED_TABLES.items():
            response = (
                supabase.table(name)
                .select("*", count="exact")
                .limit(0)
                .execute()
            )
            tables.append(
                {
                    "name": name,
                    "row_count": response.count if response.count is not None else 0,
                    "order_by": config.get("order_by"),
                }
            )
        return jsonify({"data": tables})
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@app.route("/api/tables/<table_name>", methods=["GET"])
def get_table_data(table_name: str):
    config = _get_table_config(table_name)
    if not config:
        return jsonify({"error": f"Table '{table_name}' is not available"}), 404

    try:
        supabase = get_supabase()
        query = supabase.table(table_name).select("*")

        order_by = config.get("order_by")
        if order_by:
            query = query.order(order_by, desc=config.get("desc", False))

        response = query.execute()
        return jsonify({"table": table_name, "data": response.data})
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


if __name__ == "__main__":
    import os

    port = int(os.getenv("FLASK_PORT", "5000"))
    debug = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    app.run(host="0.0.0.0", port=port, debug=debug)

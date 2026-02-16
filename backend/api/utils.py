from .models import SiteSetting

def get_settings():
    s = SiteSetting.objects.first()
    if not s:
        s = SiteSetting.objects.create()
    return s

def format_price(price_usd, price_iqd_manual, use_manual_iqd, currency="USD"):
    s = get_settings()
    if currency == "USD":
        return f"${price_usd}"
    if use_manual_iqd and price_iqd_manual is not None:
        val = int(price_iqd_manual)
    else:
        val = int(float(price_usd) * s.usd_to_iqd_rate)
        r = max(1, int(s.iqd_round_to))
        val = int(round(val / r) * r)
    return f"{val:,} د.ع"

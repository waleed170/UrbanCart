
from pathlib import Path

from playwright.sync_api import Page, expect


def open_homepage(page: Page):
    homepage = Path(__file__).resolve().parents[1] / "index.html"
    page.goto(homepage.as_uri())


def test_homepage_displays_main_heading(page: Page):
    open_homepage(page)

    expect(page.get_by_role("heading", level=1)).to_be_visible()


def test_all_products_are_displayed(page: Page):
    open_homepage(page)

    expect(page.locator("#product-grid .product-card")).to_have_count(9)


def test_search_filters_products(page: Page):
    open_homepage(page)

    page.locator("#search-input").fill("lamp")

    expect(page.locator("#product-grid .product-card")).to_have_count(1)
    expect(page.get_by_role("heading", name="Arc Table Lamp")).to_be_visible()


def test_category_filter_shows_only_selected_category(page: Page):
    open_homepage(page)

    page.locator("#category-filter").select_option(label="Lighting")

    expect(page.locator("#product-grid .product-card")).to_have_count(2)
    expect(page.locator("#product-grid .product-category")).to_have_text(
        ["Lighting", "Lighting"]
    )


def test_no_results_message_appears_for_unmatched_search(page: Page):
    open_homepage(page)

    page.locator("#search-input").fill("nonexistent-product-123")

    expect(page.locator("#product-grid .product-card")).to_have_count(0)
    expect(page.locator("#empty-message")).to_be_visible()

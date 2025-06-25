    import React from 'react';
    import breakfast1 from '../../assets/breakfast1.png';
    import breakfast2 from '../../assets/breakfast2.png';
    import breakfast3 from '../../assets/breakfast3.png';
    import lunch1 from '../../assets/lunch1.png';
    import lunch2 from '../../assets/lunch2.png';
    import lunch3 from '../../assets/lunch3.png';
    import dinner2 from '../../assets/dinner2.png';
    import dinner3 from '../../assets/dinner3.png';
    import '../../css/MenuSection.css';

    const MenuSection = () => {
    return (
        <div className="Menu">
        <h2 className="First-title">Specialties</h2>
        <h3 className="Second-title">Our Menu</h3>
        <div className="Menucontainer">
            {/* Breakfast */}
            <div className="Menu-card container1">
            <h3>BREAKFAST</h3>
            <div className="Menu-Item">
                <img src={breakfast2} alt="Pancakes" />
                <div>
                <p className="Menu-Title foodname">Pancakes</p>
                <p className="Discription">Fluffy pancakes served with maple syrup and butter.</p>
                </div>
            </div>
            <div className="Menu-Item">
                <img src={breakfast1} alt="Eggs Benedict" />
                <div>
                <p className="Menu-Title foodname">Eggs Benedict</p>
                <p className="Discription">Poached eggs on an English muffin with bacon and hollandaise sauce.</p>
                </div>
            </div>
            <div className="Menu-Item">
                <img src={breakfast3} alt="French Toast" />
                <div>
                <p className="Menu-Title foodname">French Toast</p>
                <p className="Discription">French toast topped with sugar and berries.</p>
                </div>
            </div>
            </div>

            {/* Lunch */}
            <div className="Menu-card container2">
            <h3>LUNCH</h3>
            <div className="Menu-Item">
                <img src={lunch1} alt="Steak Frites" />
                <div>
                <p className="Menu-Title foodname">Steak Frites</p>
                <p className="Discription">Sirloin steak with fries and garlic aioli.</p>
                </div>
            </div>
            <div className="Menu-Item">
                <img src={lunch2} alt="Salmon Salad" />
                <div>
                <p className="Menu-Title foodname">Salmon Salad</p>
                <p className="Discription">Grilled salmon on mixed greens with vinaigrette.</p>
                </div>
            </div>
            <div className="Menu-Item">
                <img src={lunch3} alt="Pasta Primavera" />
                <div>
                <p className="Menu-Title foodname">Pasta Primavera</p>
                <p className="Discription">Vegetables and pasta in cream sauce.</p>
                </div>
            </div>
            </div>

            {/* Dinner */}
            <div className="Menu-card container3">
            <h3>DINNER</h3>
            <div className="Menu-Item">
                <img src={breakfast2} alt="Pancakes" />
                <div>
                <p className="Menu-Title foodname">Pancakes</p>
                <p className="Discription">Fluffy pancakes served with maple syrup and butter.</p>
                </div>
            </div>
            <div className="Menu-Item">
                <img src={dinner2} alt="Lobster Tail" />
                <div>
                <p className="Menu-Title foodname">Lobster Tail</p>
                <p className="Discription">Grilled lobster with drawn butter.</p>
                </div>
            </div>
            <div className="Menu-Item">
                <img src={dinner3} alt="Vegetable Risotto" />
                <div>
                <p className="Menu-Title foodname">Vegetable Risotto</p>
                <p className="Discription">Creamy risotto with veggies and cheese.</p>
                </div>
            </div>
            </div>
        </div>
        <button className="Viewmenu">
            <a href="/Menu">Menu</a>
        </button>
        </div>
    );
    };

    export default MenuSection;

Ext.define('MyApp.view.main.footer.FooterView', {
	extend: 'Ext.Toolbar',
	xtype: 'footerview',
	cls: 'footerview',

	items: [
		{ 
			xtype: 'container',
			cls: 'footerviewtext',
			html: 'footer'
		},
//		'->',
//		{
//			xtype: 'button',
//			ui: 'footerbutton',
//			iconCls: 'x-fa fa-automobile'
//		}
	]
});

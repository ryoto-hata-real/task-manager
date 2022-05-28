export default function ({store, route, redirect}) {
  if(route.path === '/') {

    if(!store.state) {
      return redirect('/auth/signin')
    }else{
      return redirect('/top')
    }
  }
}